import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import {
  User,
  BarChart3,
  Award,
  Settings,
  LogOut,
  ChevronLeft,
  Upload,
  Edit2
} from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  phone: string;
  avatar_url: string;
  bio: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setAvatarUrl(data.avatar_url);
      }
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (!error) {
        setProfile((prev) => ({ ...prev!, ...updates }));
        setIsEditing(false);
      }
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    updateProfile({ avatar_url: publicUrl });
    setAvatarUrl(publicUrl);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const stats = [
    { label: 'Courses Completed', value: '12', icon: BarChart3 },
    { label: 'Skills Mastered', value: '7', icon: Award },
    { label: 'Certificates', value: '3', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Home
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Welcome back, {profile?.name}!</h1>
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-700"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="relative">
                <img
                  src={avatarUrl || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg cursor-pointer">
                  <Upload className="h-5 w-5 text-gray-600" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>

              <div className="mt-4 space-y-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="col-span-3 space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={profile?.name || ''}
                    onChange={(e) => setProfile({ ...profile!, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={profile?.phone || ''}
                    onChange={(e) => setProfile({ ...profile!, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <textarea
                    placeholder="Bio"
                    value={profile?.bio || ''}
                    onChange={(e) => setProfile({ ...profile!, bio: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                    rows={4}
                  />
                  <button
                    onClick={() => updateProfile(profile!)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <stat.icon className="h-6 w-6 text-blue-600 mb-2" />
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">About Me</h3>
                    <p className="text-gray-600">{profile?.bio || 'No bio added yet'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <p className="text-gray-600">Phone: {profile?.phone || 'Not provided'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;