import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { User, Award, Settings, LogOut, ChevronLeft, Upload, CreditCard as Edit2, BookOpen, Star, Trophy } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  phone: string;
  avatar_url: string;
  bio: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
    // getBadges();
    // checkFirstLogin();
  }, []);

  // const checkFirstLogin = async () => {
  //   const { data: { user } } = await supabase.auth.getUser();
  //   if (user) {
  //     const { data: existingBadges } = await supabase
  //       .from('user_badges')
  //       .select('*')
  //       .eq('user_id', user.id)
  //       .eq('badge_id', 'f0f0f0f0-0f0f-0f0f-0f0f-0f0f0f0f0f0f')
  //       .single();

  //     if (!existingBadges) {
  //       await supabase
  //         .from('user_badges')
  //         .insert({
  //           user_id: user.id,
  //           badge_id: 'f0f0f0f0-0f0f-0f0f-0f0f-0f0f0f0f0f0f'
  //         });
  //       getBadges(); // Refresh badges
  //     }
  //   }
  // };

  const getProfile = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting user:', error);
        navigate('/');
        return;
      }
      if (user) {
        // Create a basic profile from user data
        const basicProfile = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          phone: '',
          avatar_url: '',
          bio: ''
        };
        setProfile(basicProfile);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error getting user:', error);
      navigate('/');
    }
  };

  // const getBadges = async () => {
  //   const { data: { user } } = await supabase.auth.getUser();
  //   if (user) {
  //     const { data } = await supabase
  //       .from('user_badges')
  //       .select(`
  //         badge_id,
  //         earned_at,
  //         badges (
  //           id,
  //           name,
  //           description,
  //           icon
  //         )
  //       `)
  //       .eq('user_id', user.id);

  //     if (data) {
  //       const formattedBadges = data.map(item => ({
  //         id: item.badges.id,
  //         name: item.badges.name,
  //         description: item.badges.description,
  //         icon: item.badges.icon,
  //         earned_at: item.earned_at
  //       }));
  //       setBadges(formattedBadges);
  //     }
  //   }
  // };

  const updateProfile = async (updates: Partial<Profile>) => {
    // For now, just update local state
    setProfile((prev) => ({ ...prev!, ...updates }));
    setIsEditing(false);
    alert('Profile updated successfully! (Note: Changes are not persisted yet)');
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Simplified avatar upload - just show a message for now
    alert('Avatar upload feature will be available soon!');
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/');
    } else {
      alert('Error signing out: ' + error.message);
    }
  };

  const stats = [
    { icon: BookOpen, label: 'Courses Enrolled', value: '3' },
    { icon: Star, label: 'Average Rating', value: '4.8' },
    { icon: Trophy, label: 'Badges Earned', value: badges.length.toString() }
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
            <h1 className="text-2xl font-bold">Welcome back, {profile?.name || 'Student'}!</h1>
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
                  src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=3b82f6&color=fff&size=200`}
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
                    onClick={() => {
                      if (profile) {
                        updateProfile({
                          name: profile.name,
                          phone: profile.phone,
                          bio: profile.bio
                        });
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
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
                    <h3 className="font-semibold mb-4">Badges Earned</h3>
                    {badges.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {badges.map((badge) => (
                          <div key={badge.id} className="text-center">
                            <img
                              src={badge.icon}
                              alt={badge.name}
                              className="w-16 h-16 mx-auto mb-2"
                            />
                            <h4 className="font-medium text-sm">{badge.name}</h4>
                            <p className="text-xs text-gray-500">{new Date(badge.earned_at).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center">No badges earned yet. Complete courses to earn badges!</p>
                    )}
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