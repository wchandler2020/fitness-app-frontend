import React, { useState } from 'react';
import { X, Sparkles, Target, Clock, Dumbbell, Zap, ChevronRight, RefreshCw } from 'lucide-react';
import { generateAIWorkoutApi, saveAIWorkoutApi } from '../../api/workoutsApi';

const AIWorkoutGenerator = ({ isOpen, onClose, onWorkoutGenerated }) => {
    const [step, setStep] = useState(1); // 1: Preferences, 2: Generating, 3: Review
    const [preferences, setPreferences] = useState({
        fitness_level: 'intermediate',
        goals: '',
        duration: 60,
        focus_areas: [],
        equipment: [],
        type: 'strength',
        injuries: ''
    });
    const [generatedWorkout, setGeneratedWorkout] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    const fitnessLevels = [
        { value: 'beginner', label: 'Beginner', desc: 'New to working out' },
        { value: 'intermediate', label: 'Intermediate', desc: '6+ months experience' },
        { value: 'advanced', label: 'Advanced', desc: '2+ years experience' }
    ];

    const workoutTypes = [
        { value: 'strength', label: 'Strength', icon: Dumbbell, desc: 'Build max strength' },
        { value: 'hypertrophy', label: 'Hypertrophy', icon: Target, desc: 'Muscle growth' },
        { value: 'endurance', label: 'Endurance', icon: Zap, desc: 'Stamina & conditioning' }
    ];

    const focusOptions = [
        'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'
    ];

    const equipmentOptions = [
        'Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Kettlebell', 'Resistance Band'
    ];

    const toggleArrayItem = (array, item) => {
        if (array.includes(item)) {
            return array.filter(i => i !== item);
        }
        return [...array, item];
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);
        setStep(2);

        try {
            const response = await generateAIWorkoutApi({
                ...preferences,
                focus_areas: preferences.focus_areas.map(f => f.toLowerCase()),
                equipment: preferences.equipment.map(e => e.toLowerCase())
            });

            setGeneratedWorkout(response);
            setStep(3);
        } catch (err) {
            console.error('AI Generation Error:', err);
            setError(err.response?.data?.detail || err.message || 'Failed to generate workout. Please try again.');
            setStep(1);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveWorkout = async () => {
        try {
            const response = await saveAIWorkoutApi(generatedWorkout);
            
            alert('✅ AI Workout saved successfully!');
            onWorkoutGenerated?.();
            onClose();
        } catch (err) {
            console.error('Save Error:', err);
            alert('Failed to save workout. Please try again.');
        }
    };

    const handleRegenerate = () => {
        setStep(1);
        setGeneratedWorkout(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                AI Workout Generator
                                <span className="text-xs font-normal text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">
                                    Beta
                                </span>
                            </h2>
                            <p className="text-sm text-slate-400">
                                {step === 1 && 'Tell us your preferences'}
                                {step === 2 && 'Generating your personalized workout...'}
                                {step === 3 && 'Review your AI-generated workout'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: Preferences */}
                    {step === 1 && (
                        <div className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Fitness Level */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">
                                    Fitness Level
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {fitnessLevels.map(level => (
                                        <button
                                            key={level.value}
                                            type="button"
                                            onClick={() => setPreferences({ ...preferences, fitness_level: level.value })}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                                                preferences.fitness_level === level.value
                                                    ? 'border-purple-500 bg-purple-500/10'
                                                    : 'border-slate-700 hover:border-slate-600'
                                            }`}
                                        >
                                            <p className="font-semibold text-sm">{level.label}</p>
                                            <p className="text-xs text-slate-400 mt-1">{level.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Goals */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Goals *
                                </label>
                                <input
                                    type="text"
                                    value={preferences.goals}
                                    onChange={(e) => setPreferences({ ...preferences, goals: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                                    placeholder="e.g., Build muscle, lose weight, get stronger..."
                                />
                            </div>

                            {/* Workout Type */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">
                                    Workout Type
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {workoutTypes.map(type => {
                                        const Icon = type.icon;
                                        return (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setPreferences({ ...preferences, type: type.value })}
                                                className={`p-4 rounded-xl border-2 transition-all ${
                                                    preferences.type === type.value
                                                        ? 'border-purple-500 bg-purple-500/10'
                                                        : 'border-slate-700 hover:border-slate-600'
                                                }`}
                                            >
                                                <Icon className="w-6 h-6 mb-2 mx-auto text-purple-400" />
                                                <p className="font-semibold text-sm text-center">{type.label}</p>
                                                <p className="text-xs text-slate-400 text-center mt-1">{type.desc}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Duration: {preferences.duration} minutes
                                </label>
                                <input
                                    type="range"
                                    min="30"
                                    max="120"
                                    step="15"
                                    value={preferences.duration}
                                    onChange={(e) => setPreferences({ ...preferences, duration: Number(e.target.value) })}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>30 min</span>
                                    <span>120 min</span>
                                </div>
                            </div>

                            {/* Focus Areas */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Focus Areas (Optional)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {focusOptions.map(focus => (
                                        <button
                                            key={focus}
                                            type="button"
                                            onClick={() => setPreferences({
                                                ...preferences,
                                                focus_areas: toggleArrayItem(preferences.focus_areas, focus)
                                            })}
                                            className={`px-4 py-2 rounded-lg text-sm transition-all ${
                                                preferences.focus_areas.includes(focus)
                                                    ? 'bg-purple-500 text-white'
                                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            }`}
                                        >
                                            {focus}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Equipment */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Available Equipment (Optional)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {equipmentOptions.map(equip => (
                                        <button
                                            key={equip}
                                            type="button"
                                            onClick={() => setPreferences({
                                                ...preferences,
                                                equipment: toggleArrayItem(preferences.equipment, equip)
                                            })}
                                            className={`px-4 py-2 rounded-lg text-sm transition-all ${
                                                preferences.equipment.includes(equip)
                                                    ? 'bg-purple-500 text-white'
                                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            }`}
                                        >
                                            {equip}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Injuries */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Injuries or Limitations (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={preferences.injuries}
                                    onChange={(e) => setPreferences({ ...preferences, injuries: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                                    placeholder="e.g., Lower back pain, shoulder injury..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Generating */}
                    {step === 2 && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="relative">
                                <Sparkles className="w-20 h-20 text-purple-400 animate-pulse" />
                                <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full animate-ping" />
                            </div>
                            <h3 className="text-2xl font-bold mt-6 mb-2">Creating Your Workout</h3>
                            <p className="text-slate-400 text-center max-w-md">
                                Our AI is analyzing your preferences and generating a personalized workout plan...
                            </p>
                            <div className="flex gap-2 mt-8">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {step === 3 && generatedWorkout && (
                        <div className="space-y-6">
                            {/* Workout Header */}
                            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30">
                                <h3 className="text-2xl font-bold mb-2">{generatedWorkout.workout_name}</h3>
                                <p className="text-slate-300 mb-4">{generatedWorkout.description}</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1 text-slate-400">
                                        <Clock className="w-4 h-4" />
                                        {generatedWorkout.estimated_duration} min
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-400">
                                        <Dumbbell className="w-4 h-4" />
                                        {generatedWorkout.exercises?.length || 0} exercises
                                    </span>
                                </div>
                            </div>

                            {/* Warm-up */}
                            {generatedWorkout.warm_up_notes && (
                                <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                                    <h4 className="font-semibold text-sm mb-2 text-emerald-400">Warm-up</h4>
                                    <p className="text-sm text-slate-300">{generatedWorkout.warm_up_notes}</p>
                                </div>
                            )}

                            {/* Exercises */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-slate-300">Exercises</h4>
                                {generatedWorkout.exercises?.map((exercise, idx) => (
                                    <div key={idx} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h5 className="font-semibold">{exercise.exercise_name}</h5>
                                                <p className="text-sm text-slate-400">
                                                    {exercise.target_sets} sets × {exercise.target_reps} reps
                                                </p>
                                            </div>
                                            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                                                {exercise.rest_seconds}s rest
                                            </span>
                                        </div>
                                        {exercise.notes && (
                                            <p className="text-xs text-slate-400 mt-2 italic">💡 {exercise.notes}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Cool-down */}
                            {generatedWorkout.cool_down_notes && (
                                <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                                    <h4 className="font-semibold text-sm mb-2 text-blue-400">Cool-down</h4>
                                    <p className="text-sm text-slate-300">{generatedWorkout.cool_down_notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
                    {step === 1 && (
                        <>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={!preferences.goals}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Sparkles className="w-4 h-4" />
                                Generate Workout
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <button
                                onClick={handleRegenerate}
                                className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Regenerate
                            </button>
                            <button
                                onClick={handleSaveWorkout}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl text-sm font-semibold transition-colors"
                            >
                                Save & Use Workout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIWorkoutGenerator;