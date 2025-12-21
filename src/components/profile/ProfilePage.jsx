// components/profile/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { User, MapPin, Mail, Phone, Instagram, Globe, Save, Camera } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { getMyProfileApi, updateMyProfileApi } from '../../api/profileApi';

const ProfilePage = () => {
    const user = useAuthStore(state => state.user);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await getMyProfileApi();
            setProfile(data);
            setFormData({
                bio: data.bio || '',
                city: data.city || '',
                state: data.state || '',
                zip_code: data.zip_code || '',
                phone: user.phone_number || '',
                instagram_handle: data.instagram_handle || '',
                website_url: data.website_url || '',
                // Trainer-specific
                specializations: data.specializations || [],
                certifications: data.certifications || [],
                years_experience: data.years_experience || '',
                hourly_rate: data.hourly_rate || '',
                offers_in_person: data.offers_in_person ?? true,
                offers_virtual: data.offers_virtual ?? false,
                offers_home_visits: data.offers_home_visits ?? false,
                // Client-specific
                fitness_level: data.fitness_level || '',
                fitness_goals: data.fitness_goals || [],
                injuries_limitations: data.injuries_limitations || '',
            });
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await updateMyProfileApi(formData);
            alert('✅ Profile updated successfully!');
            setIsEditing(false);
            loadProfile();
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <User className="w-12 h-12 mx-auto mb-4 animate-pulse text-emerald-400" />
                    <p className="text-slate-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/90 to-emerald-900/60" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">My Profile</h1>
                        <p className="text-slate-400 mt-1">
                            {user.role === 'trainer' ? 'Your trainer profile' : 'Your fitness profile'}
                        </p>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-medium transition-colors"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    loadProfile();
                                }}
                                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-medium transition-colors disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Profile Content */}
                <div className="space-y-6">
                    {/* Avatar Section */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-2xl font-bold">
                                    {user.full_name?.charAt(0) || 'U'}
                                </div>
                                {isEditing && (
                                    <button className="absolute bottom-0 right-0 p-2 bg-slate-800 rounded-full border border-slate-700 hover:bg-slate-700 transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold">{user.full_name}</h2>
                                <p className="text-slate-400 capitalize">{user.role}</p>
                                <p className="text-emerald-400 text-sm mt-1">{profile?.display_location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label="Bio"
                                icon={User}
                                type="textarea"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                disabled={!isEditing}
                                placeholder="Tell us about yourself..."
                                rows={4}
                                fullWidth
                            />
                            <FormField
                                label="Email"
                                icon={Mail}
                                value={user.email}
                                disabled
                            />
                            <FormField
                                label="Phone"
                                icon={Phone}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                disabled={!isEditing}
                                placeholder="(555) 123-4567"
                            />
                            <FormField
                                label="City"
                                icon={MapPin}
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                disabled={!isEditing}
                                placeholder="Chicago"
                                required={user.role === 'trainer'}
                            />
                            <FormField
                                label="State"
                                icon={MapPin}
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                disabled={!isEditing}
                                placeholder="IL"
                                required={user.role === 'trainer'}
                            />
                            <FormField
                                label="Zip Code"
                                icon={MapPin}
                                value={formData.zip_code}
                                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                                disabled={!isEditing}
                                placeholder="60601"
                            />
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label="Instagram"
                                icon={Instagram}
                                value={formData.instagram_handle}
                                onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                                disabled={!isEditing}
                                placeholder="@yourusername"
                            />
                            <FormField
                                label="Website"
                                icon={Globe}
                                value={formData.website_url}
                                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                disabled={!isEditing}
                                placeholder="https://yourwebsite.com"
                            />
                        </div>
                    </div>

                    {/* Trainer-Specific Sections */}
                    {user.role === 'trainer' && (
                        <>
                            <TrainerProfessionalInfo
                                formData={formData}
                                setFormData={setFormData}
                                isEditing={isEditing}
                            />
                            <TrainerServicesInfo
                                formData={formData}
                                setFormData={setFormData}
                                isEditing={isEditing}
                            />
                        </>
                    )}

                    {/* Client-Specific Sections */}
                    {user.role === 'client' && (
                        <ClientFitnessInfo
                            formData={formData}
                            setFormData={setFormData}
                            isEditing={isEditing}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// Reusable Form Field Component
const FormField = ({ label, icon: Icon, type = 'text', value, onChange, disabled, placeholder, required, rows, fullWidth }) => {
    const inputClass = `w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed`;
    
    return (
        <div className={fullWidth ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-medium text-slate-300 mb-2">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />}
                {type === 'textarea' ? (
                    <textarea
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        placeholder={placeholder}
                        rows={rows || 3}
                        className={inputClass}
                        style={{ paddingLeft: Icon ? '2.75rem' : '1rem' }}
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        placeholder={placeholder}
                        className={inputClass}
                        style={{ paddingLeft: Icon ? '2.75rem' : '1rem' }}
                    />
                )}
            </div>
        </div>
    );
};

// Trainer Professional Info Section
const TrainerProfessionalInfo = ({ formData, setFormData, isEditing }) => {
    const addSpecialization = () => {
        const spec = prompt('Enter specialization:');
        if (spec) {
            setFormData({
                ...formData,
                specializations: [...formData.specializations, spec]
            });
        }
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        label="Years Experience"
                        type="number"
                        value={formData.years_experience}
                        onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                        disabled={!isEditing}
                        placeholder="5"
                    />
                    <FormField
                        label="Hourly Rate ($)"
                        type="number"
                        value={formData.hourly_rate}
                        onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                        disabled={!isEditing}
                        placeholder="75"
                        required
                    />
                </div>

                {/* Specializations */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Specializations
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.specializations?.map((spec, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm flex items-center gap-2"
                            >
                                {spec}
                                {isEditing && (
                                    <button
                                        onClick={() => setFormData({
                                            ...formData,
                                            specializations: formData.specializations.filter((_, i) => i !== idx)
                                        })}
                                        className="text-emerald-400 hover:text-emerald-300"
                                    >
                                        ×
                                    </button>
                                )}
                            </span>
                        ))}
                    </div>
                    {isEditing && (
                        <button
                            onClick={addSpecialization}
                            className="text-sm text-emerald-400 hover:text-emerald-300"
                        >
                            + Add Specialization
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Trainer Services Section
const TrainerServicesInfo = ({ formData, setFormData, isEditing }) => {
    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Service Offerings</h3>
            <div className="space-y-3">
                <CheckboxField
                    label="In-Person Training"
                    checked={formData.offers_in_person}
                    onChange={(e) => setFormData({ ...formData, offers_in_person: e.target.checked })}
                    disabled={!isEditing}
                />
                <CheckboxField
                    label="Virtual/Online Training"
                    checked={formData.offers_virtual}
                    onChange={(e) => setFormData({ ...formData, offers_virtual: e.target.checked })}
                    disabled={!isEditing}
                />
                <CheckboxField
                    label="Home Visits"
                    checked={formData.offers_home_visits}
                    onChange={(e) => setFormData({ ...formData, offers_home_visits: e.target.checked })}
                    disabled={!isEditing}
                />
            </div>
        </div>
    );
};

// Client Fitness Info Section
const ClientFitnessInfo = ({ formData, setFormData, isEditing }) => {
    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Fitness Information</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Fitness Level
                    </label>
                    <select
                        value={formData.fitness_level}
                        onChange={(e) => setFormData({ ...formData, fitness_level: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-400 disabled:opacity-50"
                    >
                        <option value="">Select level...</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                <FormField
                    label="Injuries or Limitations"
                    type="textarea"
                    value={formData.injuries_limitations}
                    onChange={(e) => setFormData({ ...formData, injuries_limitations: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Any injuries, medical conditions, or physical limitations..."
                    rows={3}
                    fullWidth
                />
            </div>
        </div>
    );
};

// Checkbox Field Component
const CheckboxField = ({ label, checked, onChange, disabled }) => {
    return (
        <label className="flex items-center gap-3 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="w-5 h-5 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-slate-300">{label}</span>
        </label>
    );
};

export default ProfilePage;