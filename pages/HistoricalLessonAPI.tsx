// pages/HistoricalLessonAPI.tsx
import { useEffect, useState } from 'react';

// ---- Type Definitions ----
interface LessonSettings {
  name: string;
  subject: string;
  grade: number;
  length: number;
  narration: 'teacher' | 'historical_character';
  narrator_name?: string;
  includeQuiz?: boolean;
}

interface Frame {
  title: string;
  timestamp: string;
  prompt: string;
  status: string;
  imageUrl?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface Lesson {
  id: string;
  classSettings: {
    name: string;
    subject: string;
    gradeLevel: number;
  };
  lessonLength: string;
  storyStyle: string;
  narrator: string;
  frames: Frame[];
  quiz?: {
    questions: QuizQuestion[];
  };
  status: string;
  createdAt: string;
}

interface LessonProgress {
  lessonId: string;
  totalFrames: number;
  completedFrames: number;
  failedFrames: number;
  progress: number;
  status: string;
  frames: Frame[];
}

// ---- API Class ----
export class HistoricalLessonAPI {
  baseURL: string;
  activePolling: Map<string, NodeJS.Timeout>;

  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    this.activePolling = new Map();
  }

  async generateLesson(lessonSettings: LessonSettings): Promise<{ lessonId: string; lesson: Lesson }> {
    const response = await fetch(`${this.baseURL}/generate-lesson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lessonSettings)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate lesson');
    }

    return await response.json();
  }

  async getLesson(lessonId: string): Promise<Lesson> {
    const response = await fetch(`${this.baseURL}/lesson/${lessonId}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch lesson');
    }
    return await response.json();
  }

  async getLessonProgress(lessonId: string): Promise<LessonProgress> {
    const response = await fetch(`${this.baseURL}/lesson/${lessonId}/progress`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch progress');
    }
    return await response.json();
  }

  async getSubjects(): Promise<{ subjects: string[]; narrators: string[] }> {
    const response = await fetch(`${this.baseURL}/subjects`);
    if (!response.ok) throw new Error('Failed to fetch subjects');
    return await response.json();
  }

  startPolling(
    lessonId: string,
    callbacks: {
      onProgress?: (progress: LessonProgress) => void;
      onComplete?: (lesson: LessonProgress) => void;
      onError?: (error: Error) => void;
      onFrameComplete?: (frame: Frame) => void;
    } = {}
  ): void {
    const {
      onProgress = () => { },
      onComplete = () => { },
      onError = () => { },
      onFrameComplete = () => { }
    } = callbacks;

    this.stopPolling(lessonId);

    const poll = async () => {
      try {
        const progress = await this.getLessonProgress(lessonId);
        onProgress(progress);

        progress.frames.forEach((frame) => {
          if (frame.status === 'completed' && frame.imageUrl) {
            onFrameComplete(frame);
          }
        });

        if (progress.status === 'completed') {
          onComplete(progress);
          this.stopPolling(lessonId);
        } else if (progress.status === 'failed') {
          onError(new Error('Lesson generation failed'));
          this.stopPolling(lessonId);
        } else {
          this.activePolling.set(lessonId, setTimeout(poll, 2000));
        }
      } catch (error) {
        onError(error as Error);
        this.stopPolling(lessonId);
      }
    };

    poll();
  }

  stopPolling(lessonId: string) {
    const timeoutId = this.activePolling.get(lessonId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.activePolling.delete(lessonId);
    }
  }

  stopAllPolling() {
    this.activePolling.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.activePolling.clear();
  }

  async healthCheck(): Promise<{ status: string; timestamp?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy', error: (error as Error).message };
    }
  }
}

// ---- LessonBuilder Helper ----
export class LessonBuilder {
  api: HistoricalLessonAPI;
  currentLesson: Lesson | null = null;

  constructor(apiClient: HistoricalLessonAPI) {
    this.api = apiClient;
  }

  async buildLesson(formData: any): Promise<{ lessonId: string; lesson: Lesson }> {
    const lessonSettings: LessonSettings = {
      name: formData.className,
      subject: formData.subject,
      grade: parseInt(formData.grade),
      length: parseInt(formData.length),
      narration: formData.narration,
      narrator_name: formData.narratorName,
      includeQuiz: formData.includeQuiz || false
    };

    const result = await this.api.generateLesson(lessonSettings);
    this.currentLesson = result.lesson;
    return result;
  }

  async startGeneration(
    lessonId: string,
    uiCallbacks: {
      updateProgress?: (percent: number, label: string) => void;
      updateFrameStatus?: (title: string, status: string, imageUrl?: string) => void;
      onComplete?: (lesson: Lesson) => void;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<void> {
    const {
      updateProgress = () => { },
      updateFrameStatus = () => { },
      onComplete = () => { },
      onError = () => { }
    } = uiCallbacks;

    this.api.startPolling(lessonId, {
      onProgress: (progress) => {
        updateProgress(progress.progress, `${progress.completedFrames}/${progress.totalFrames} frames complete`);
      },
      onFrameComplete: (frame) => {
        updateFrameStatus(frame.title, frame.status, frame.imageUrl);
      },
      onComplete: async () => {
        const fullLesson = await this.api.getLesson(lessonId);
        this.currentLesson = fullLesson;
        onComplete(fullLesson);
      },
      onError: onError
    });
  }

  getCurrentLesson() {
    return this.currentLesson;
  }

  exportLesson(format: 'json' | 'csv' | 'html'): string {
    if (!this.currentLesson) throw new Error('No lesson to export');

    switch (format) {
      case 'json':
        return JSON.stringify(this.currentLesson, null, 2);
      case 'csv':
        return this.exportToCSV();
      case 'html':
        return this.exportToHTML();
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private exportToCSV(): string {
    if (!this.currentLesson) return '';
    const rows = [['Title', 'Timestamp', 'Prompt', 'Status', 'Image URL']];
    this.currentLesson.frames.forEach((f) =>
      rows.push([f.title, f.timestamp, f.prompt.replace(/"/g, '""'), f.status, f.imageUrl || ''])
    );
    return rows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n');
  }

  private exportToHTML(): string {
    if (!this.currentLesson) return '';
    const lesson = this.currentLesson;

    return `
<!DOCTYPE html>
<html>
<head><title>${lesson.classSettings.name}</title></head>
<body>
  <h1>${lesson.classSettings.name}</h1>
  <p><strong>Subject:</strong> ${lesson.classSettings.subject}</p>
  <p><strong>Grade:</strong> ${lesson.classSettings.gradeLevel}</p>
  <p><strong>Length:</strong> ${lesson.lessonLength}</p>
  <p><strong>Narration:</strong> ${lesson.storyStyle}</p>

  <h2>Frames</h2>
  ${lesson.frames.map((f) => `
    <div>
      <h3>${f.title} (${f.timestamp})</h3>
      ${f.imageUrl ? `<img src="${f.imageUrl}" style="max-width:100%">` : ''}
      <p>${f.prompt}</p>
    </div>`).join('')}

  ${lesson.quiz ? `
    <h2>Quiz</h2>
    ${lesson.quiz.questions.map((q, i) => `
      <div>
        <p><strong>Q${i + 1}:</strong> ${q.question}</p>
        <ul>${q.options.map(o => `<li>${o}${o === q.answer ? ' ✓' : ''}</li>`).join('')}</ul>
      </div>`).join('')}
  ` : ''}
</body>
</html>`;
  }
}

// ---- React Hook ----
export function useHistoricalLessonAPI(baseURL = 'http://localhost:3000/api') {
  const [api] = useState(() => new HistoricalLessonAPI(baseURL));
  const [builder] = useState(() => new LessonBuilder(api));

  useEffect(() => {
    return () => api.stopAllPolling();
  }, [api]);

  return { api, builder };
}