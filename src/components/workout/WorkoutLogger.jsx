import React, { useState, useEffect } from 'react';
import {
    X, Plus, Trash2, Save, Calendar, Clock, Star,
    Dumbbell, Search, ChevronDown, TrendingUp
} from 'lucide-react';
import { getExercisesApi, createWorkoutApi } from '../../api/workoutsApi';

const WorkoutLogger = ({ isOpen, onClose, onSuccess }) => {
    const [workoutData, setWorkoutData] = useState({
        name: '',
        workout_date: new Date().toISOString().split('T')[0],
        start_time: '',
        end_time: '',
        duration_minutes: null,
        notes: '',
        energy_rating: null,
        difficulty_rating: null,
        is_favorite: false,
        is_template: false,
        template_name: '',
    });

    const [exercises, setExercises] = useState([]);
    const [exerciseLibrary, setExerciseLibrary] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showExercisePicker, setShowExercisePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadExerciseLibrary();
        }
    }, [isOpen]);

    const loadExerciseLibrary = async () => {
        try {
            const data = await getExercisesApi();
            setExerciseLibrary(data);
        } catch (error) {
            console.error('Error loading exercises:', error);
        }
    };

    const addExercise = (exercise) => {
        const newExercise = {
            exercise: exercise.id,
            exercise_name: exercise.name,
            order: exercises.length,
            sets_data: [
                { set: 1, reps: null, weight: null, rpe: null, completed: true }
            ],
            target_sets: 3,
            target_reps: '8-12',
            rest_seconds: 90,
            notes: ''
        };
        setExercises([...exercises, newExercise]);
        setShowExercisePicker(false);
        setSearchQuery('');
    };

    const removeExercise = (index) => {
        setExercises(exercises.filter((_, i) => i !== index));
    };

    const updateExercise = (index, field, value) => {
        const updated = [...exercises];
        updated[index] = { ...updated[index], [field]: value };
        setExercises(updated);
    };

    const addSet = (exerciseIndex) => {
        const updated = [...exercises];
        const currentSets = updated[exerciseIndex].sets_data;
        const newSet = {
            set: currentSets.length + 1,
            reps: null,
            weight: null,
            rpe: null,
            completed: true
        };
        updated[exerciseIndex].sets_data = [...currentSets, newSet];
        setExercises(updated);
    };

    const removeSet = (exerciseIndex, setIndex) => {
        const updated = [...exercises];
        updated[exerciseIndex].sets_data = updated[exerciseIndex].sets_data.filter((_, i) => i !== setIndex);
        // Renumber sets
        updated[exerciseIndex].sets_data = updated[exerciseIndex].sets_data.map((set, i) => ({
            ...set,
            set: i + 1
        }));
        setExercises(updated);
    };

    const updateSet = (exerciseIndex, setIndex, field, value) => {
        const updated = [...exercises];
        updated[exerciseIndex].sets_data[setIndex] = {
            ...updated[exerciseIndex].sets_data[setIndex],
            [field]: field === 'reps' || field === 'weight' || field === 'rpe'
                ? (value === '' ? null : Number(value))
                : value
        };
        setExercises(updated);
    };

    const handleSubmit = async () => {
        if (!workoutData.name.trim()) {
            alert('Please enter a workout name');
            return;
        }

        if (exercises.length === 0) {
            alert('Please add at least one exercise');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                ...workoutData,
                exercise_logs: exercises.map(ex => ({
                    exercise: ex.exercise,
                    order: ex.order,
                    sets_data: ex.sets_data,
                    target_sets: ex.target_sets,
                    target_reps: ex.target_reps,
                    rest_seconds: ex.rest_seconds,
                    notes: ex.notes
                }))
            };

            const response = await createWorkoutApi(payload);

            if (response.prs_achieved && response.prs_achieved.length > 0) {
                alert(`🎉 Workout logged! You hit ${response.prs_achieved.length} new PR(s)!`);
            } else {
                alert('✅ Workout logged successfully!');
            }

            onSuccess?.();
            onClose();
            resetForm();
        } catch (error) {
            console.error('Error logging workout:', error);
            alert('Failed to log workout. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setWorkoutData({
            name: '',
            workout_date: new Date().toISOString().split('T')[0],
            start_time: '',
            end_time: '',
            duration_minutes: null,
            notes: '',
            energy_rating: null,
            difficulty_rating: null,
            is_favorite: false,
            is_template: false,
            template_name: '',
        });
        setExercises([]);
    };

    const filteredExercises = exerciseLibrary.filter(ex =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.muscle_groups.some(mg => mg.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-xl">
                            <Dumbbell className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Log Workout</h2>
                            <p className="text-sm text-slate-400">Track your training session</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Workout Name *
                            </label>
                            <input
                                type="text"
                                value={workoutData.name}
                                onChange={(e) => setWorkoutData({ ...workoutData, name: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                placeholder="e.g., Push Day, Leg Day"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="date"
                                    value={workoutData.workout_date}
                                    onChange={(e) => setWorkoutData({ ...workoutData, workout_date: e.target.value })}
                                    className="w-full pl-11 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Duration (minutes)
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="number"
                                    value={workoutData.duration_minutes || ''}
                                    onChange={(e) => setWorkoutData({ ...workoutData, duration_minutes: e.target.value ? Number(e.target.value) : null })}
                                    className="w-full pl-11 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                    placeholder="60"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Energy Level (1-5)
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(rating => (
                                    <button
                                        key={rating}
                                        type="button"
                                        onClick={() => setWorkoutData({ ...workoutData, energy_rating: rating })}
                                        className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                                            workoutData.energy_rating === rating
                                                ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                                                : 'border-slate-700 text-slate-400 hover:border-slate-600'
                                        }`}
                                    >
                                        {rating}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Exercises Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Exercises</h3>
                            <button
                                type="button"
                                onClick={() => setShowExercisePicker(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-sm font-medium transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Exercise
                            </button>
                        </div>

                        {exercises.length === 0 ? (
                            <div className="text-center py-8 bg-slate-800/40 rounded-xl border border-slate-700/60">
                                <Dumbbell className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                                <p className="text-slate-400 text-sm">No exercises added yet</p>
                                <p className="text-slate-500 text-xs mt-1">Click "Add Exercise" to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {exercises.map((exercise, exIndex) => (
                                    <ExerciseBlock
                                        key={exIndex}
                                        exercise={exercise}
                                        onRemove={() => removeExercise(exIndex)}
                                        onAddSet={() => addSet(exIndex)}
                                        onRemoveSet={(setIndex) => removeSet(exIndex, setIndex)}
                                        onUpdateSet={(setIndex, field, value) => updateSet(exIndex, setIndex, field, value)}
                                        onUpdateExercise={(field, value) => updateExercise(exIndex, field, value)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Workout Notes
                        </label>
                        <textarea
                            value={workoutData.notes}
                            onChange={(e) => setWorkoutData({ ...workoutData, notes: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 resize-none"
                            placeholder="How did the workout feel? Any notes for next time?"
                        />
                    </div>

                    {/* Save Options */}
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={workoutData.is_favorite}
                                onChange={(e) => setWorkoutData({ ...workoutData, is_favorite: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
                            />
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-slate-300">Save as Favorite</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={workoutData.is_template}
                                onChange={(e) => setWorkoutData({ ...workoutData, is_template: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-300">Save as Template</span>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4" />
                        {isSubmitting ? 'Saving...' : 'Log Workout'}
                    </button>
                </div>
            </div>

            {/* Exercise Picker Modal */}
            {showExercisePicker && (
                <ExercisePicker
                    exercises={filteredExercises}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSelect={addExercise}
                    onClose={() => {
                        setShowExercisePicker(false);
                        setSearchQuery('');
                    }}
                />
            )}
        </div>
    );
};

// Exercise Block Component
const ExerciseBlock = ({ exercise, onRemove, onAddSet, onRemoveSet, onUpdateSet, onUpdateExercise }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-slate-800/60 rounded-xl border border-slate-700 overflow-hidden">
            {/* Exercise Header */}
            <div className="flex items-center justify-between p-4 bg-slate-800/80">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 hover:bg-slate-700 rounded transition-colors"
                    >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                    </button>
                    <div>
                        <h4 className="font-semibold text-white">{exercise.exercise_name}</h4>
                        <p className="text-xs text-slate-400">{exercise.sets_data.length} sets</p>
                    </div>
                </div>
                <button
                    onClick={onRemove}
                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Sets Table */}
            {isExpanded && (
                <div className="p-4 space-y-3">
                    <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-400 px-2">
                        <div className="col-span-2">Set</div>
                        <div className="col-span-3">Reps</div>
                        <div className="col-span-3">Weight (lbs)</div>
                        <div className="col-span-3">RPE</div>
                        <div className="col-span-1"></div>
                    </div>

                    {exercise.sets_data.map((set, setIndex) => (
                        <div key={setIndex} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-2 text-sm font-medium text-slate-300 px-2">
                                {set.set}
                            </div>
                            <div className="col-span-3">
                                <input
                                    type="number"
                                    value={set.reps || ''}
                                    onChange={(e) => onUpdateSet(setIndex, 'reps', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
                                    placeholder="10"
                                />
                            </div>
                            <div className="col-span-3">
                                <input
                                    type="number"
                                    value={set.weight || ''}
                                    onChange={(e) => onUpdateSet(setIndex, 'weight', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
                                    placeholder="135"
                                />
                            </div>
                            <div className="col-span-3">
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={set.rpe || ''}
                                    onChange={(e) => onUpdateSet(setIndex, 'rpe', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
                                    placeholder="7"
                                />
                            </div>
                            <div className="col-span-1">
                                {exercise.sets_data.length > 1 && (
                                    <button
                                        onClick={() => onRemoveSet(setIndex)}
                                        className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={onAddSet}
                        className="w-full py-2 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-lg text-sm text-slate-400 hover:text-emerald-400 transition-all"
                    >
                        + Add Set
                    </button>
                </div>
            )}
        </div>
    );
};

// Exercise Picker Modal
const ExercisePicker = ({ exercises, searchQuery, onSearchChange, onSelect, onClose }) => {
    return (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[600px] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <h3 className="text-lg font-bold text-white">Select Exercise</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-slate-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search exercises..."
                            className="w-full pl-11 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {exercises.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <p>No exercises found</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {exercises.map(exercise => (
                                <button
                                    key={exercise.id}
                                    onClick={() => onSelect(exercise)}
                                    className="w-full text-left p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-semibold text-white">{exercise.name}</h4>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {exercise.muscle_groups.join(', ')} • {exercise.equipment}
                                            </p>
                                        </div>
                                        <span className="text-xs text-emerald-400 font-medium">
                                            {exercise.difficulty}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkoutLogger;