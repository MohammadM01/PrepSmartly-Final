import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
// // import Button from '../components/ui/Button';

const Dashboard = () => {
    const { currentUser, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/signin');
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
                <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#333]">
                    <h2 className="text-xl mb-4">Welcome, {currentUser?.user_metadata?.full_name || currentUser?.email}</h2>
                    <p className="text-gray-400 mb-6">You are successfully logged in.</p>

                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
