import React, { useState, useEffect, useMemo } from 'react';
import { Home, BookOpen, Brain, Music, Shield, Users, Target, Activity, Settings, User, Trophy, Zap, MessageSquare, Sparkle } from 'lucide-react'; // Added Sparkle icon

// Main App Component
function App() {
  // State to manage the current view of the application
  const [currentView, setCurrentView] = useState('onboarding'); // 'onboarding', 'dashboard', 'education', 'habitTracker', 'activities', 'aiMentor', 'music', 'triggerBlocker', 'community', 'mindset', 'badges'

  // State to store user data from the onboarding survey
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    gender: '',
    habits: [],
    duration: {}, // e.g., { 'Smoking': '1-5 years' }
    triggers: [],
    reasonToQuit: '',
    goals: { shortTerm: '', longTerm: '' },
    schedule: '',
    healthStatus: '',
    supportSystem: '',
    musicPreference: ''
  });

  // State to manage habit streaks and points
  const [habitStreaks, setHabitStreaks] = useState({}); // e.g., { 'Smoking': { streak: 0, lastCheckIn: null } }
  const [points, setPoints] = useState(0);
  const [loggedUrges, setLoggedUrges] = useState([]); // State for logging urges

  // State for daily activities completion
  const [dailyActivityCompletion, setDailyActivityCompletion] = useState(() => {
    const saved = localStorage.getItem('dailyActivityCompletion');
    return saved ? JSON.parse(saved) : {};
  });

  // State for AI mentor chat history
  const [aiChatHistory, setAiChatHistory] = useState([
    { role: 'ai', text: 'Hello! I am your AI mentor. How can I support you today?' }
  ]);

  // Plant Progress Tracker States
  const [plantStage, setPlantStage] = useState('seed'); // 'seed', 'sprout', 'small', 'medium', 'mature', 'dry'
  const [plantGrowthPercentage, setPlantGrowthPercentage] = useState(0); // 0-100% within current stage
  const [plantDryReason, setPlantDryReason] = useState(null); // Stores the habit that caused the plant to dry

  // Motivation Quote State
  const [motivationQuote, setMotivationQuote] = useState('');

  // Define badges
  const allBadges = useMemo(() => [
    { name: 'Beginner Booster', description: 'Earned 50 points.', threshold: 50, icon: '🌟' },
    { name: 'Habit Helper', description: 'Earned 100 points. Keep going!', threshold: 100, icon: '✨' },
    { name: 'Streak Starter', description: 'Achieved a 7-day streak for any habit.', threshold: null, condition: (habits) => Object.values(habits).some(h => h.streak >= 7), icon: '🔥' },
    { name: 'Mindful Mover', description: 'Completed a meditation or exercise activity.', threshold: null, icon: '💡' }, // Placeholder for activity completion
    { name: 'Diligence Dynamo', description: 'Earned 250 points.', threshold: 250, icon: '🏆' },
    { name: 'Resilience Riser', description: 'Overcame a streak break and restarted strong.', threshold: null, icon: '💪' }, // Placeholder for specific comeback logic
    { name: 'Consistent Crusader', description: 'Achieved a 30-day streak for any habit.', threshold: null, condition: (habits) => Object.values(habits).some(h => h.streak >= 30), icon: '🗓️' },
    { name: 'Wellness Warrior', description: 'Earned 500 points.', threshold: 500, icon: '🥇' },
    { name: 'Freedom Fighter', description: 'Earned 1000 points. You are truly committed!', threshold: 1000, icon: '🕊️' },
    { name: 'Ultimate Achiever', description: 'Earned 2000 points. You are inspiring!', threshold: 2000, icon: '👑' },
  ], []);

  // Effect to initialize habit streaks once onboarding is complete and habits are selected
  useEffect(() => {
    if (userData.habits.length > 0 && currentView !== 'onboarding') {
      const initialStreaks = {};
      userData.habits.forEach(habit => {
        if (!habitStreaks[habit]) { // Only initialize if not already present
          initialStreaks[habit] = { streak: 0, lastCheckIn: null };
        }
      });
      setHabitStreaks(prev => ({ ...prev, ...initialStreaks }));
    }
  }, [userData.habits, currentView]); // Rerun when habits change or view changes from onboarding

  // Effect for Plant Progress (grow/dry)
  useEffect(() => {
    const growthThresholds = {
      'seed': 0,
      'sprout': 50,
      'small': 150,
      'medium': 300,
      'mature': 500
    };

    let newStage = 'seed';
    let newPercentage = 0;

    if (plantStage === 'dry') {
        // If dry, stay dry until a new milestone is achieved or points significantly increase.
        // For simplicity, if it's dry, it remains dry until user explicitly grows it back (or we add more complex logic)
        // For this demo, let's assume if it's dry, it means a setback, and it stays dry unless points exceed previous highest threshold.
        // Or, if points increase significantly, it can "regrow" past the dry state.
        // For simplicity, let's allow it to regrow based on points even after drying.
        setPlantDryReason(null); // Clear dry reason if points are accumulating again
    }


    if (points >= growthThresholds['mature']) {
      newStage = 'mature';
      newPercentage = 100;
    } else if (points >= growthThresholds['medium']) {
      newStage = 'medium';
      newPercentage = ((points - growthThresholds['medium']) / (growthThresholds['mature'] - growthThresholds['medium'])) * 100;
    } else if (points >= growthThresholds['small']) {
      newStage = 'small';
      newPercentage = ((points - growthThresholds['small']) / (growthThresholds['medium'] - growthThresholds['small'])) * 100;
    } else if (points >= growthThresholds['sprout']) {
      newStage = 'sprout';
      newPercentage = ((points - growthThresholds['sprout']) / (growthThresholds['small'] - growthThresholds['sprout'])) * 100;
    } else if (points >= growthThresholds['seed']) {
      newStage = 'seed';
      newPercentage = ((points - growthThresholds['seed']) / (growthThresholds['sprout'] - growthThresholds['seed'])) * 100;
    }

    setPlantStage(newStage);
    setPlantGrowthPercentage(Math.min(100, Math.max(0, newPercentage))); // Ensure percentage is between 0-100
  }, [points]); // Rerun when points change

  // Effect for Daily Motivation Quote
  useEffect(() => {
    const quotes = [
      "The best way to predict the future is to create it.",
      "Your limitation—it’s only your imagination.",
      "Push yourself, because no one else is going to do it for you.",
      "Great things never come from comfort zones.",
      "Success doesn’t just find you. You have to go out and get it.",
      "The harder you work for something, the greater you’ll feel when you achieve it.",
      "Dream bigger. Do bigger.",
      "Don’t stop when you’re tired. Stop when you’re done.",
      "Wake up with determination. Go to bed with satisfaction.",
      "Do something today that your future self will thank you for."
    ];
    // Simple way to get a "daily" quote - based on day of year, changes daily.
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setMotivationQuote(quotes[dayOfYear % quotes.length]);
  }, []); // Run once on component mount

  // Effect to manage daily activities
  useEffect(() => {
    const todayStr = new Date().toDateString();
    if (!dailyActivityCompletion[todayStr]) {
      // Reset or initialize activities for the new day
      setDailyActivityCompletion(prev => ({
        ...prev,
        [todayStr]: {
          'Morning Meditation': false,
          'Morning Exercise': false,
          'Afternoon Reading': false,
          'Afternoon Mindfulness Break': false,
          'Evening Journaling': false,
          'Evening Gratitude Practice': false,
          'Night Reflection': false,
          'Night Deep Breathing': false,
        }
      }));
    }
    localStorage.setItem('dailyActivityCompletion', JSON.stringify(dailyActivityCompletion));
  }, [dailyActivityCompletion]); // Dependency on dailyActivityCompletion to save changes

  // Function to handle daily habit check-in
  const handleHabitCheckIn = (habitName) => {
    const today = new Date().toDateString();
    const currentStreakData = habitStreaks[habitName];

    if (!currentStreakData) {
      console.error(`Habit streak data not found for ${habitName}`);
      return;
    }

    // Check if already checked in today
    if (currentStreakData.lastCheckIn === today) {
      alert(`You've already checked in for ${habitName} today!`); // Using alert for simplicity, would be a custom modal in production
      return;
    }

    const newStreak = currentStreakData.streak + 1;
    let earnedPoints = 10; // +10 points per clean day

    // Add bonus points for streak milestones (example, can be more complex)
    if (newStreak === 7) earnedPoints += 50; // Weekly streak
    if (newStreak === 30) earnedPoints += 200; // Monthly streak
    if (newStreak === 90) earnedPoints += 500; // Quarterly streak
    if (newStreak === 180) earnedPoints += 1000; // Half-yearly streak
    if (newStreak === 365) earnedPoints += 2000; // Yearly streak


    setHabitStreaks(prev => ({
      ...prev,
      [habitName]: { streak: newStreak, lastCheckIn: today }
    }));
    setPoints(prevPoints => prevPoints + earnedPoints);
    alert(`Great job! You've maintained your streak for ${habitName} for ${newStreak} days. You earned ${earnedPoints} points!`);

    // Reset plant dry reason if a new streak is achieved
    if (plantStage === 'dry') {
        setPlantDryReason(null);
    }
  };

  // Function to handle streak break
  const handleStreakBreak = (habitName) => {
    const currentStreakData = habitStreaks[habitName];
    if (!currentStreakData) {
      console.error(`Habit streak data not found for ${habitName}`);
      return;
    }

    // Only set plant to dry if it's not already dry and a streak was actually active
    if (currentStreakData.streak > 0 && plantStage !== 'dry') {
        setPlantStage('dry');
        setPlantDryReason(habitName); // Store which habit caused the dry state
    }

    // Reset streak and deduct points
    const newStreak = 0;
    const newPoints = Math.max(0, points - 15); // -15 points if streak is broken, don't go below 0

    setHabitStreaks(prev => ({
      ...prev,
      [habitName]: { streak: newStreak, lastCheckIn: null } // Reset last check-in too
    }));
    setPoints(newPoints);
    alert(`Oh no, your streak for ${habitName} was broken. It's okay, every day is a new start! You lost 15 points.`);
  };

  // Function to handle logging an urge
  const handleLogUrge = (habit, trigger) => {
    const newUrge = {
      id: Date.now(),
      habit: habit,
      trigger: trigger || 'Unknown',
      timestamp: new Date().toLocaleString()
    };
    setLoggedUrges(prev => [...prev, newUrge]);
    alert(`Urge logged for ${habit} (Trigger: ${trigger || 'Unknown'}). Let's try a coping strategy!`);
    // In a real app, this would trigger specific interventions or guide the user.
  };

  // Function to handle daily activity checkmark
  const handleActivityCompletion = (activityName) => {
    const todayStr = new Date().toDateString();
    setDailyActivityCompletion(prev => {
      const updatedDayActivities = {
        ...prev[todayStr],
        [activityName]: !prev[todayStr]?.[activityName] // Toggle completion
      };
      // Award points if completed, deduct if uncompleted (optional, can be points only on completion)
      if (updatedDayActivities[activityName]) {
        setPoints(prevPoints => prevPoints + 5); // +5 points for completing an activity
        alert(`Activity "${activityName}" completed! You earned 5 points.`);
      } else {
        setPoints(prevPoints => Math.max(0, prevPoints - 5)); // Deduct points if unchecking
        alert(`Activity "${activityName}" unchecked. Points deducted.`);
      }

      return {
        ...prev,
        [todayStr]: updatedDayActivities
      };
    });
  };


  // --- Helper Components for different views ---

  // Onboarding Survey Component
  const Onboarding = ({ userData, setUserData, setCurrentView }) => {
    const [step, setStep] = useState(1);
    const [selectedHabits, setSelectedHabits] = useState([]);
    const [selectedTriggers, setSelectedTriggers] = useState([]);

    const commonHabits = ['Alcohol', 'Smoking', 'Social Media', 'Mobile Addiction', 'Porn', 'Masturbation', 'Drugs', 'Unhealthy Eating'];
    const commonTriggers = ['Stress', 'Boredom', 'Loneliness', 'Peer Pressure', 'Fatigue', 'Anxiety', 'Depression'];

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleHabitToggle = (habit) => {
      setSelectedHabits(prev =>
        prev.includes(habit) ? prev.filter(h => h !== habit) : [...prev, habit]
      );
    };

    const handleTriggerToggle = (trigger) => {
      setSelectedTriggers(prev =>
        prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]
      );
    };

    const handleDurationChange = (habit, duration) => {
      setUserData(prev => ({
        ...prev,
        duration: { ...prev.duration, [habit]: duration }
      }));
    };

    const handleSubmit = () => {
      setUserData(prev => ({
        ...prev,
        habits: selectedHabits,
        triggers: selectedTriggers
      }));
      setCurrentView('dashboard');
    };

    const renderStep = () => {
      switch (step) {
        case 1:
          return (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Welcome to Sankalp!</h2>
              <p className="text-center text-gray-600 mb-6">Let's get to know you better to create your personalized journey.</p>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={userData.age}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                  placeholder="Your Age"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <button
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transform transition duration-200 hover:scale-105"
              >
                Next
              </button>
            </>
          );
        case 2:
          return (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">What habits are you working on?</h2>
              <p className="text-center text-gray-600 mb-6">Select all that apply.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {commonHabits.map(habit => (
                  <button
                    key={habit}
                    onClick={() => handleHabitToggle(habit)}
                    className={`py-2 px-4 rounded-lg border-2 transition duration-200 ${selectedHabits.includes(habit) ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                      }`}
                  >
                    {habit}
                  </button>
                ))}
              </div>
              {selectedHabits.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 text-gray-700">Duration of each habit:</h3>
                  {selectedHabits.map(habit => (
                    <div key={habit} className="mb-3">
                      <label className="block text-gray-700 text-sm font-bold mb-1">{habit}</label>
                      <select
                        value={userData.duration[habit] || ''}
                        onChange={(e) => handleDurationChange(habit, e.target.value)}
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                      >
                        <option value="">Select Duration</option>
                        <option value="Less than 1 year">Less than 1 year</option>
                        <option value="1-5 years">1-5 years</option>
                        <option value="5-10 years">5-10 years</option>
                        <option value="More than 10 years">More than 10 years</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-200 hover:scale-105"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-200 hover:scale-105"
                >
                  Next
                </button>
              </div>
            </>
          );
        case 3:
          return (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">What are your triggers?</h2>
              <p className="text-center text-gray-600 mb-6">Understanding them is key to overcoming.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {commonTriggers.map(trigger => (
                  <button
                    key={trigger}
                    onClick={() => handleTriggerToggle(trigger)}
                    className={`py-2 px-4 rounded-lg border-2 transition duration-200 ${selectedTriggers.includes(trigger) ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                      }`}
                  >
                    {trigger}
                  </button>
                ))}
