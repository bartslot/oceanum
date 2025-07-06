import { useHistoricalLessonAPI } from "backend/lessonAPI";
import { useEffect } from "react";


const { builder } = useHistoricalLessonAPI('http://localhost:3000/api');

useEffect(() => {
    const lessonSettings = {
        name: '12th Grade - Rome History',
        subject: 'History of Rome',
        grade: 12,
        length: 5,
        narration: 'historical_character',
        narrator_name: 'Julius Caesar',
        includeQuiz: true
    };

    builder.buildLesson(lessonSettings)
        .then(result => {
            builder.startGeneration(result.lessonId, {
                updateProgress: (percent, message) => console.log(percent, message),
                updateFrameStatus: (title, status, imageUrl) => console.log(title, status, imageUrl),
                onComplete: (lesson) => console.log('Completed lesson', lesson),
                onError: (err) => console.error('Generation error', err)
            });
        });
}, []);