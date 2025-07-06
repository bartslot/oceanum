const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const HAILUO_API_KEY = process.env.HAILUO_API_KEY || 'your-hailuo-api-key';
const HAILUO_API_URL = 'https://api.aimlapi.com/v1/images/generations'; // Using AIMLAPI for Hailuo
const PORT = process.env.PORT || 3000;

// In-memory storage for lessons (replace with database in production)
const lessons = new Map();
const generationTasks = new Map();

// Historical narrators with their perspectives
const NARRATORS = {
    'Julius Caesar': {
        perspective: 'first_person',
        voice: 'authoritative, reflective, sometimes dramatic',
        context: 'Roman general, politician, and dictator'
    },
    'Cleopatra': {
        perspective: 'first_person',
        voice: 'regal, intelligent, strategic',
        context: 'Last pharaoh of Egypt'
    },
    'Napoleon Bonaparte': {
        perspective: 'first_person',
        voice: 'ambitious, tactical, grandiose',
        context: 'French military leader and emperor'
    },
    'Teacher': {
        perspective: 'third_person',
        voice: 'educational, neutral, engaging',
        context: 'Modern educator explaining historical events'
    }
};

// Scene timing calculator
function calculateSceneTiming(totalMinutes, includeQuiz) {
    const totalSeconds = totalMinutes * 60;
    const quizSeconds = includeQuiz ? 60 : 0;
    const contentSeconds = totalSeconds - quizSeconds;

    // Aim for 30-60 seconds per scene
    const numScenes = Math.max(3, Math.min(8, Math.floor(contentSeconds / 45)));
    const secondsPerScene = Math.floor(contentSeconds / numScenes);

    return { numScenes, secondsPerScene, quizSeconds };
}

// Historical content templates
const HISTORICAL_SUBJECTS = {
    'History of Rome': {
        scenes: [
            { title: 'The Legend Begins', content: 'Romulus and Remus founding myth' },
            { title: 'Founding of the Republic', content: 'Overthrow of kings, establishment of Senate' },
            { title: 'Rise of the Republic', content: 'Expansion, Punic Wars, Republican system' },
            { title: 'The Power of Rome', content: 'Cultural achievements, Colosseum, engineering' },
            { title: 'Julius Caesar\'s Era', content: 'Civil war, dictatorship, reforms, assassination' },
            { title: 'Legacy of Rome', content: 'Impact on Western civilization' }
        ],
        quizQuestions: [
            {
                question: 'What year was Rome founded?',
                options: ['1500 BC', '753 BC', '4500 BC', '6000 BC'],
                answer: '753 BC'
            },
            {
                question: 'What replaced the kings in Rome?',
                options: ['Republic (Senate rule)', 'Julius Caesar', 'Empire', 'Consuls'],
                answer: 'Republic (Senate rule)'
            },
            {
                question: 'What river did Julius Caesar cross to start civil war?',
                options: ['Rubicon', 'Tiber', 'Nile', 'Thames'],
                answer: 'Rubicon'
            }
        ]
    },
    'French Revolution': {
        scenes: [
            { title: 'The Old Regime', content: 'Social inequality, financial crisis' },
            { title: 'The Estates-General', content: 'Calling of representatives, Tennis Court Oath' },
            { title: 'Storming the Bastille', content: 'July 14, 1789 - symbol of revolution' },
            { title: 'Reign of Terror', content: 'Robespierre, guillotine, executions' },
            { title: 'Rise of Napoleon', content: 'Military genius takes power' }
        ],
        quizQuestions: [
            {
                question: 'When did the French Revolution begin?',
                options: ['1789', '1792', '1799', '1804'],
                answer: '1789'
            },
            {
                question: 'What was stormed on July 14, 1789?',
                options: ['Bastille', 'Versailles', 'Louvre', 'Notre Dame'],
                answer: 'Bastille'
            }
        ]
    }
};

// Generate visual prompt for Hailuo-AI
function generateVisualPrompt(scene, narrator, gradeLevel, sceneIndex, totalScenes) {
    const isAdvanced = gradeLevel >= 10;
    const narrator_info = NARRATORS[narrator] || NARRATORS['Teacher'];

    let prompt = '';

    // Add cinematic direction
    if (sceneIndex === 0) {
        prompt += 'Establishing shot: ';
    } else if (sceneIndex === totalScenes - 1) {
        prompt += 'Dramatic finale: ';
    } else {
        prompt += 'Medium shot: ';
    }

    // Add scene-specific content based on the template
    switch (scene.title) {
        case 'The Legend Begins':
            prompt += `On a rocky hill at dawn, young Romulus stands over his twin Remus, sword raised in a fateful moment. Remus lies on the ground as the first light of 753 BC breaks over the Tiber River valley. Ancient Roman villagers in simple tunics watch in shock from afar. The half-built wooden walls of primordial Rome rise in the background, and a she-wolf silhouette recalls their mythical childhood.`;
            break;

        case 'Founding of the Republic':
            prompt += `In the Roman Forum, citizens rejoice as the tyrant king's crown is cast down the temple steps. Lucius Junius Brutus holds aloft the Republic's banner amid a crowd of toga-clad Romans. Marble columns and bronze statues glint in morning sunlight. The scene marks 509 BC, the birth of the Roman Republic.`;
            break;

        case 'Rise of the Republic':
            prompt += `A sweeping view of Roman legions marching under the SPQR eagle standard. In the foreground, senators in white togas debate on the Senate steps. The Mediterranean expands in the background showing Rome's growing influence. War elephants and ships hint at the Punic Wars victory.`;
            break;

        case 'The Power of Rome':
            prompt += `A grand view of the Colosseum in its glory, with detailed arches and columns. Gladiators salute the crowd while Roman citizens fill the stands. The architecture showcases Roman engineering prowess. ${narrator === 'Julius Caesar' ? 'Caesar\'s ghostly figure observes from the foreground, noting this marvel built after his time.' : ''}`;
            break;

        case 'Julius Caesar\'s Era':
            prompt += `Scene montage: Julius Caesar in battle armor crosses the Rubicon River at dusk with his legion. Transition to Caesar in crimson toga addressing the Senate. Finally, the Ides of March - senators with daggers surround Caesar at the Theatre of Pompey as he falls in shock.`;
            break;

        default:
            prompt += scene.content;
    }

    // Add narrator perspective if historical character
    if (narrator_info.perspective === 'first_person' && narrator !== 'Teacher') {
        prompt += ` ${narrator} observes the scene with ${narrator_info.voice} demeanor.`;
    }

    // Add style tags
    prompt += ` -- Style: pencil sketch, soft watercolor, 2D illustration, ${isAdvanced ? 'detailed historical accuracy' : 'simplified educational'}, muted colors, ${isAdvanced ? 'dramatic lighting' : 'gentle lighting'}, historically accurate clothing and architecture.`;

    return prompt;
}

// Generate quiz prompt
function generateQuizPrompt(questions, narrator) {
    return `A parchment scroll unfurls with quiz questions written in elegant script. ${narrator === 'Julius Caesar' ? 'Julius Caesar\'s cartoon figure appears at the side, playfully gesturing as he quizzes the viewer.' : 'A friendly teacher figure points to the questions with a wooden pointer.'} The background shows subtle Roman motifs - columns, laurel leaves, and marble textures. -- Style: pencil sketch, minimal watercolor, 2D, clear text focus, educational illustration.`;
}

// API Routes

// Generate lesson endpoint
app.post('/api/generate-lesson', async (req, res) => {
    try {
        const {
            name,
            subject,
            grade,
            length,
            narration,
            narrator_name,
            includeQuiz
        } = req.body;

        // Validate inputs
        if (!name || !subject || !grade || !length) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const lessonId = uuidv4();
        const timing = calculateSceneTiming(parseInt(length), includeQuiz);
        const subjectData = HISTORICAL_SUBJECTS[subject];

        if (!subjectData) {
            return res.status(400).json({ error: 'Subject not supported' });
        }

        // Create lesson structure
        const lesson = {
            id: lessonId,
            classSettings: {
                name,
                subject,
                gradeLevel: parseInt(grade)
            },
            lessonLength: `${length} minutes`,
            storyStyle: narration === 'historical_character' ?
                `Historical Narration (${narrator_name})` :
                'Teacher Narration',
            narrator: narrator_name || 'Teacher',
            frames: [],
            quiz: includeQuiz ? {
                questions: subjectData.quizQuestions.slice(0, Math.min(3, subjectData.quizQuestions.length))
            } : null,
            status: 'generating',
            createdAt: new Date().toISOString()
        };

        // Generate frames
        const scenesToUse = subjectData.scenes.slice(0, timing.numScenes);
        let currentTime = 0;

        scenesToUse.forEach((scene, index) => {
            const startTime = currentTime;
            const endTime = currentTime + timing.secondsPerScene;

            const frame = {
                title: scene.title,
                timestamp: `${Math.floor(startTime / 60)}:${String(startTime % 60).padStart(2, '0')}–${Math.floor(endTime / 60)}:${String(endTime % 60).padStart(2, '0')}`,
                prompt: generateVisualPrompt(scene, narrator_name || 'Teacher', parseInt(grade), index, scenesToUse.length),
                status: 'pending',
                imageUrl: null
            };

            lesson.frames.push(frame);
            currentTime = endTime;
        });

        // Add quiz frame if requested
        if (includeQuiz) {
            const quizStartTime = currentTime;
            const quizEndTime = currentTime + timing.quizSeconds;

            lesson.frames.push({
                title: 'Interactive Quiz',
                timestamp: `${Math.floor(quizStartTime / 60)}:${String(quizStartTime % 60).padStart(2, '0')}–${Math.floor(quizEndTime / 60)}:${String(quizEndTime % 60).padStart(2, '0')}`,
                prompt: generateQuizPrompt(lesson.quiz.questions, narrator_name || 'Teacher'),
                status: 'pending',
                imageUrl: null
            });
        }

        // Store lesson
        lessons.set(lessonId, lesson);

        // Start background image generation
        generateLessonImages(lessonId);

        res.json({
            lessonId,
            lesson: {
                ...lesson,
                frames: lesson.frames.map(f => ({
                    title: f.title,
                    timestamp: f.timestamp,
                    status: f.status
                }))
            }
        });

    } catch (error) {
        console.error('Error generating lesson:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get lesson status
app.get('/api/lesson/:id', (req, res) => {
    const lesson = lessons.get(req.params.id);
    if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json(lesson);
});

// Get lesson progress
app.get('/api/lesson/:id/progress', (req, res) => {
    const lesson = lessons.get(req.params.id);
    if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
    }

    const totalFrames = lesson.frames.length;
    const completedFrames = lesson.frames.filter(f => f.status === 'completed').length;
    const failedFrames = lesson.frames.filter(f => f.status === 'failed').length;

    res.json({
        lessonId: req.params.id,
        totalFrames,
        completedFrames,
        failedFrames,
        progress: Math.round((completedFrames / totalFrames) * 100),
        status: lesson.status,
        frames: lesson.frames.map(f => ({
            title: f.title,
            status: f.status,
            imageUrl: f.imageUrl
        }))
    });
});

// Background image generation
async function generateLessonImages(lessonId) {
    const lesson = lessons.get(lessonId);
    if (!lesson) return;

    try {
        lesson.status = 'generating_images';

        for (let i = 0; i < lesson.frames.length; i++) {
            const frame = lesson.frames[i];

            try {
                frame.status = 'generating';

                // Call Hailuo-AI API (using AIMLAPI as proxy)
                const response = await axios.post(HAILUO_API_URL, {
                    model: 'minimax/image-01',
                    prompt: frame.prompt,
                    num_images: 1,
                    size: '1024x1024',
                    quality: 'standard'
                }, {
                    headers: {
                        'Authorization': `Bearer ${HAILUO_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000 // 30 second timeout
                });

                if (response.data && response.data.data && response.data.data[0]) {
                    frame.imageUrl = response.data.data[0].url;
                    frame.status = 'completed';
                } else {
                    throw new Error('No image returned from API');
                }

            } catch (error) {
                console.error(`Error generating image for frame ${i}:`, error.message);
                frame.status = 'failed';
                frame.error = error.message;
            }

            // Small delay between API calls to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Update lesson status
        const completedFrames = lesson.frames.filter(f => f.status === 'completed').length;
        const totalFrames = lesson.frames.length;

        if (completedFrames === totalFrames) {
            lesson.status = 'completed';
        } else if (completedFrames > 0) {
            lesson.status = 'partially_completed';
        } else {
            lesson.status = 'failed';
        }

    } catch (error) {
        console.error('Error in generateLessonImages:', error);
        lesson.status = 'failed';
        lesson.error = error.message;
    }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        activeGeneations: generationTasks.size,
        totalLessons: lessons.size
    });
});

// Get available subjects
app.get('/api/subjects', (req, res) => {
    res.json({
        subjects: Object.keys(HISTORICAL_SUBJECTS),
        narrators: Object.keys(NARRATORS)
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Historical Storytelling API running on port ${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  POST /api/generate-lesson - Generate new lesson`);
    console.log(`  GET /api/lesson/:id - Get lesson details`);
    console.log(`  GET /api/lesson/:id/progress - Get generation progress`);
    console.log(`  GET /api/subjects - Get available subjects and narrators`);
    console.log(`  GET /api/health - Health check`);
});

module.exports = app;