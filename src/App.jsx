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
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reasonToQuit">Why do you want to quit?</label>
                <textarea
                  id="reasonToQuit"
                  name="reasonToQuit"
                  value={userData.reasonToQuit}
                  onChange={handleChange}
                  rows="3"
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 resize-none"
                  placeholder="e.g., For my health, family, productivity..."
                ></textarea>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Short-term Goals</label>
                <input
                  type="text"
                  name="shortTerm"
                  value={userData.goals.shortTerm}
                  onChange={(e) => setUserData(prev => ({ ...prev, goals: { ...prev.goals, shortTerm: e.target.value } }))}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 mb-3"
                  placeholder="e.g., No smoking for 7 days"
                />
                <label className="block text-gray-700 text-sm font-bold mb-2">Long-term Goals</label>
                <input
                  type="text"
                  name="longTerm"
                  value={userData.goals.longTerm}
                  onChange={(e) => setUserData(prev => ({ ...prev, goals: { ...prev.goals, longTerm: e.target.value } }))}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                  placeholder="e.g., Live a healthier life, be a better parent"
                />
              </div>
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
        case 4:
          return (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Almost there!</h2>
              <p className="text-center text-gray-600 mb-6">A few more details to fine-tune your plan.</p>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="schedule">Preferred Daily Schedule</label>
                <textarea
                  id="schedule"
                  name="schedule"
                  value={userData.schedule}
                  onChange={handleChange}
                  rows="2"
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 resize-none"
                  placeholder="e.g., Morning workout, evening reading"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="healthStatus">Mental and Physical Health Status</label>
                <textarea
                  id="healthStatus"
                  name="healthStatus"
                  value={userData.healthStatus}
                  onChange={handleChange}
                  rows="2"
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 resize-none"
                  placeholder="e.g., Good overall, mild anxiety"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supportSystem">Support System</label>
                <input
                  type="text"
                  id="supportSystem"
                  name="supportSystem"
                  value={userData.supportSystem}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                  placeholder="e.g., Family, friends, alone"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="musicPreference">Music Preference</label>
                <input
                  type="text"
                  id="musicPreference"
                  name="musicPreference"
                  value={userData.musicPreference}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                  placeholder="e.g., Classical, Lofi, Ambient"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-200 hover:scale-105"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-200 hover:scale-105"
                >
                  Finish Onboarding
                </button>
              </div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl my-8 font-inter">
        {renderStep()}
      </div>
    );
  };

  // PlantProgress Component (moved here for better encapsulation)
  const PlantProgress = ({ plantStage, plantGrowthPercentage, plantDryReason }) => {
    // Simple SVG for the container
    const SphereContainer = () => (
      <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-1/2 -translate-x-1/2">
        {/* Base Soil */}
        <ellipse cx="75" cy="140" rx="70" ry="10" fill="#7B3F00" />
        {/* Glass Sphere - bottom half */}
        <path d="M5 75 C 5 120, 145 120, 145 75 C 145 30, 75 30, 75 30 C 5 30, 5 75, 5 75Z" fill="white" fillOpacity="0.1" stroke="#ccc" strokeWidth="2"/>
        {/* Glass Sphere - top half (clearer for plant) */}
        <path d="M5 75 C 5 30, 75 30, 75 30 C 145 30, 145 75, 145 75" fill="none" stroke="#ccc" strokeWidth="2" strokeDasharray="5,5"/>
      </svg>
    );

    // Emojis/Text for plant stages
    const getPlantEmoji = (stage) => {
      switch (stage) {
        case 'seed': return '🌰';
        case 'sprout': return '🌱';
        case 'small': return '🌿';
        case 'medium': return '🌳';
        case 'mature': return '🌲';
        case 'dry': return '枯'; // withered tree icon
        default: return '🌰';
      }
    };

    const getPlantMessage = (stage, percentage, dryReason) => {
        if (stage === 'dry') {
            return dryReason ? `Your plant withered because of ${dryReason}. It's okay, you can grow it back!` : "Your plant has withered. Time to regrow!";
        }
        if (stage === 'mature') return "Your plant is mature and thriving! Keep up the amazing work.";
        return `Your plant is a ${stage} and ${Math.round(percentage)}% grown in this stage. Keep nurturing it!`;
    };

    return (
      <div className="relative w-48 h-64 mx-auto flex flex-col items-center justify-start pb-4"> {/* Increased height to h-64 and added pb-4 */}
        <div className="relative w-full h-48 flex items-center justify-center"> {/* Container for SVG and emoji */}
            <SphereContainer />
            <div className={`relative z-10 text-6xl transition-all duration-1000 ${plantStage === 'dry' ? 'filter grayscale' : ''}`}>
                {getPlantEmoji(plantStage)}
            </div>
            {plantStage !== 'dry' && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-3/4 bg-gray-200 rounded-full h-2 z-20 overflow-hidden">
                    <div
                        className="bg-green-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${plantGrowthPercentage}%` }}
                    ></div>
                </div>
            )}
        </div>
        <p className="text-center text-sm text-gray-700 mt-4"> {/* Removed absolute positioning */}
            {getPlantMessage(plantStage, plantGrowthPercentage, plantDryReason)}
        </p>
      </div>
    );
  };


  // Dashboard Component
  const Dashboard = ({ userData, points, habitStreaks, setCurrentView, handleLogUrge, loggedUrges, motivationQuote, plantStage, plantGrowthPercentage, plantDryReason }) => {
    const { habits, triggers } = userData; // Destructure habits and triggers from userData
    const [selectedUrgeHabit, setSelectedUrgeHabit] = useState(habits[0] || '');
    const [selectedUrgeTrigger, setSelectedUrgeTrigger] = useState(triggers[0] || '');

    useEffect(() => {
      // Set initial selected habit and trigger based on userData once habits/triggers are loaded
      if (habits.length > 0 && !selectedUrgeHabit) {
        setSelectedUrgeHabit(habits[0]);
      }
      if (triggers.length > 0 && !selectedUrgeTrigger) {
        setSelectedUrgeTrigger(triggers[0]);
      }
    }, [habits, triggers, selectedUrgeHabit, selectedUrgeTrigger]);


    return (
      <div className="p-6 font-inter">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Hello, {userData.name}!</h1>
        <p className="text-xl text-gray-700 mb-8 text-center">Your Journey to Freedom Begins Here.</p>

        {/* Daily Motivation Quote */}
        <div className="bg-blue-50 p-6 rounded-xl shadow-inner mb-8 border border-blue-200 text-center italic text-gray-800">
            "{motivationQuote}"
        </div>

        {/* Reason to Quit */}
        {userData.reasonToQuit && (
          <div className="bg-green-50 p-6 rounded-xl shadow-inner mb-8 border border-green-200 text-center">
            <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center justify-center">
              <Sparkle className="w-6 h-6 mr-2 text-green-600" />
              Your Powerful Purpose
            </h2>
            <p className="text-gray-800 leading-relaxed italic">
              "{userData.reasonToQuit}"
            </p>
            <p className="text-sm text-gray-600 mt-2">Remember this reason when things get tough!</p>
          </div>
        )}

        {/* Plant Progress Tracker */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center justify-center">
                <Trophy className="w-6 h-6 mr-2 text-green-600" />
                Your Growth Plant
            </h2>
            <PlantProgress
                plantStage={plantStage}
                plantGrowthPercentage={plantGrowthPercentage}
                plantDryReason={plantDryReason}
            />
        </div>

        {/* Log Urge Section - Moved to Dashboard */}
        <div className="bg-red-50 p-6 rounded-xl shadow-inner mb-8 border border-red-200">
            <h2 className="text-2xl font-semibold text-red-700 mb-4 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-red-600" />
                Log an Urge
            </h2>
            <p className="text-gray-800 mb-4">Feeling an urge right now? Log it to acknowledge it and explore coping strategies.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                    <label htmlFor="urgeHabit" className="block text-gray-700 text-sm font-bold mb-2">Which habit?</label>
                    <select
                        id="urgeHabit"
                        value={selectedUrgeHabit}
                        onChange={(e) => setSelectedUrgeHabit(e.target.value)}
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500"
                    >
                        {habits.length > 0 ? (
                            habits.map(habit => <option key={habit} value={habit}>{habit}</option>)
                        ) : (
                            <option value="">No habits selected</option>
                        )}
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="urgeTrigger" className="block text-gray-700 text-sm font-bold mb-2">What triggered it?</label>
                    <select
                        id="urgeTrigger"
                        value={selectedUrgeTrigger}
                        onChange={(e) => setSelectedUrgeTrigger(e.target.value)}
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500"
                    >
                        <option value="">Select or type</option>
                        {triggers.map(trigger => <option key={trigger} value={trigger}>{trigger}</option>)}
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
            <button
                onClick={() => handleLogUrge(selectedUrgeHabit, selectedUrgeTrigger)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transform transition duration-200 hover:scale-105 flex items-center justify-center"
                disabled={!selectedUrgeHabit}
            >
                <Zap className="w-5 h-5 mr-2" /> Log Urge
            </button>
            {loggedUrges.length > 0 && (
              <div className="mt-4 text-sm text-gray-700">
                <p className="font-semibold">Recently Logged Urges:</p>
                <ul className="list-disc list-inside">
                  {loggedUrges.slice(-3).map(urge => ( // Show last 3 urges
                    <li key={urge.id}>{urge.habit} (Trigger: {urge.trigger}) at {urge.timestamp}</li>
                  ))}
                </ul>
              </div>
            )}
        </div>


        {/* AI Mentor Message */}
        <div className="bg-indigo-50 p-6 rounded-xl shadow-inner mb-8 border border-indigo-200">
          <div className="flex items-start mb-4">
            <Brain className="text-indigo-600 w-8 h-8 mr-3" />
            <h2 className="text-2xl font-semibold text-indigo-700">Your AI Mentor Says:</h2>
          </div>
          <p className="text-gray-800 leading-relaxed">
            "Remember, {userData.name}, you're not broken—you’re healing. This is a process, not a punishment. It’s not about being perfect. It’s about choosing yourself again and again. Keep going, you've got this!"
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setCurrentView('aiMentor')}
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              Chat with Mentor <Brain className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white text-center flex flex-col items-center justify-center">
            <span className="text-5xl font-extrabold mb-2">{points}</span>
            <span className="text-lg font-medium">Total Points</span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center flex flex-col items-center justify-center border border-gray-200">
            <span className="text-5xl font-extrabold text-gray-900">{userData.habits.length}</span>
            <span className="text-lg font-medium text-gray-700">Habit{userData.habits.length !== 1 ? 's' : ''} Being Tracked</span>
          </div>
        </div>

        {/* Habits Progress */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-indigo-600" />
            Your Habits Progress
          </h2>
          {userData.habits.length > 0 ? (
            <div className="space-y-4">
              {userData.habits.map(habit => (
                <div key={habit} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between shadow-sm border border-gray-100">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{habit}</h3>
                    <p className="text-gray-600 text-sm">Current Streak: <span className="font-semibold text-indigo-600">{habitStreaks[habit]?.streak || 0} days</span></p>
                  </div>
                  <button
                    onClick={() => setCurrentView('habitTracker')}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm py-2 px-4 rounded-lg shadow transform transition duration-200 hover:scale-105"
                  >
                    Manage Streak
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No habits added yet. Go to settings to add some!</p>
          )}
        </div>

        {/* Quick Access Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          <button onClick={() => setCurrentView('education')} className="dashboard-button">
            <BookOpen className="w-6 h-6 mb-2" /> Education
          </button>
          <button onClick={() => setCurrentView('activities')} className="dashboard-button">
            <Activity className="w-6 h-6 mb-2" /> Activities
          </button>
          <button onClick={() => setCurrentView('music')} className="dashboard-button">
            <Music className="w-6 h-6 mb-2" /> Music
          </button>
          <button onClick={() => setCurrentView('triggerBlocker')} className="dashboard-button">
            <Shield className="w-6 h-6 mb-2" /> Triggers
          </button>
          <button onClick={() => setCurrentView('community')} className="dashboard-button">
            <Users className="w-6 h-6 mb-2" /> Community
          </button>
          <button onClick={() => setCurrentView('mindset')} className="dashboard-button">
            <Brain className="w-6 h-6 mb-2" /> Mindset
          </button>
          <button onClick={() => setCurrentView('badges')} className="dashboard-button"> {/* Added Badges button */}
            <Trophy className="w-6 h-6 mb-2" /> Badges
          </button>
          <button onClick={() => setCurrentView('settings')} className="dashboard-button">
            <Settings className="w-6 h-6 mb-2" /> Settings
          </button>
          <button onClick={() => setCurrentView('profile')} className="dashboard-button">
            <User className="w-6 h-6 mb-2" /> Profile
          </button>
        </div>

        {/* Goals Reminder */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Target className="w-6 h-6 mr-2 text-indigo-600" />
            Your Goals
          </h2>
          <div className="space-y-3 text-gray-700">
            <p><span className="font-medium">Short-term:</span> {userData.goals.shortTerm || 'Not set yet.'}</p>
            <p><span className="font-medium">Long-term:</span> {userData.goals.longTerm || 'Not set yet.'}</p>
          </div>
        </div>
      </div>
    );
  };

  // Habit Tracker Component
  const HabitTracker = ({ habits, habitStreaks, handleHabitCheckIn, handleStreakBreak, dailyActivityCompletion, handleActivityCompletion }) => {
    const todayStr = new Date().toDateString();
    const currentDayActivities = dailyActivityCompletion[todayStr] || {};

    const timeOfDayActivities = {
        'Morning': ['Morning Meditation', 'Morning Exercise'],
        'Afternoon': ['Afternoon Reading', 'Afternoon Mindfulness Break'],
        'Evening': ['Evening Journaling', 'Evening Gratitude Practice'],
        'Night': ['Night Reflection', 'Night Deep Breathing'],
    };

    return (
      <div className="p-6 font-inter max-w-2xl mx-auto bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Habit Tracker & Daily Activities</h1>

        {/* Daily Activities Section */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-inner mb-8 border border-blue-200">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-blue-600" />
                Daily Activities - {todayStr}
            </h2>
            {Object.entries(timeOfDayActivities).map(([time, activities]) => (
                <div key={time} className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{time}</h3>
                    <div className="space-y-2">
                        {activities.map(activity => (
                            <div key={activity} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                <span className="text-gray-700">{activity}</span>
                                <input
                                    type="checkbox"
                                    checked={currentDayActivities[activity] || false}
                                    onChange={() => handleActivityCompletion(activity)}
                                    className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {/* Habits Progress Section (retained) */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Target className="w-6 h-6 mr-2 text-indigo-600" />
            Your Habits Progress
          </h2>
          {habits.length > 0 ? (
            <div className="space-y-6">
              {habits.map(habit => (
                <div key={habit} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{habit}</h3>
                    <p className="text-gray-600">Current Streak: <span className="font-bold text-indigo-600">{habitStreaks[habit]?.streak || 0} days</span></p>
                    <p className="text-gray-500 text-sm">Last Checked In: {habitStreaks[habit]?.lastCheckIn || 'Never'}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleHabitCheckIn(habit)}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow transform transition duration-200 hover:scale-105 flex items-center text-sm"
                    >
                      Check In <span className="ml-1 text-lg">✅</span>
                    </button>
                    <button
                      onClick={() => handleStreakBreak(habit)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow transform transition duration-200 hover:scale-105 flex items-center text-sm"
                    >
                      Broke Streak <span className="ml-1 text-lg">❌</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">You haven't selected any habits yet. Please go to the dashboard to set them up.</p>
          )}
        </div>
      </div>
    );
  };

  // Education Module Component
  const EducationModule = ({ userData }) => {
    const { habits, triggers } = userData;
    const [generatedInsight, setGeneratedInsight] = useState('');
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [selectedHabitForInsight, setSelectedHabitForInsight] = useState(null);

    const habitDetails = {
      'Alcohol': {
        psychology: 'Alcohol provides temporary relief from stress and anxiety due to its depressive effects on the central nervous system. Over time, the brain adapts, requiring more alcohol to achieve the same effect and leading to withdrawal symptoms when consumption stops. It can become a learned coping mechanism.',
        physicalCons: 'Liver damage (fatty liver, alcoholic hepatitis, cirrhosis), cardiovascular disease, increased risk of cancers (mouth, throat, esophagus, liver, breast), weakened immune system, pancreatitis, nerve damage.',
        mentalCons: 'Worsening of depression and anxiety, memory loss, impaired judgment, increased risk of dementia, psychosis, dependence, and addiction.',
        socialEmotionalCons: 'Strained relationships with family and friends, job loss, financial problems, legal issues (DUI), social isolation, emotional numbing, increased aggression or irritability, loss of self-esteem.',
        guidelines: 'Limit intake, avoid drinking alone, find alternative stress relievers, seek support from friends/family or professional groups like AA.',
        whatToDo: 'Focus on harm reduction first. Set specific limits. Replace drinking with hobbies. Seek professional counseling if unable to quit alone. Identify and manage triggers. Build a strong support network.'
      },
      'Smoking': {
        psychology: 'Nicotine is highly addictive, stimulating dopamine release and creating a strong reward pathway. Smoking is also a powerful ritual, often linked to social situations, stress relief, and post-meal habits. Breaking the habit involves addressing both chemical dependence and behavioral patterns.',
        physicalCons: 'Lung cancer, emphysema, chronic bronchitis, heart disease, stroke, peripheral artery disease, weakened bones, premature aging of skin, increased risk of many other cancers (bladder, kidney, pancreas, etc.).',
        mentalCons: 'Increased anxiety and irritability during withdrawal, difficulty concentrating, dependence, and addiction. While some smoke for stress relief, it ultimately exacerbates stress and anxiety in the long term.',
        socialEmotionalCons: 'Social stigma, financial burden from cigarette costs, impact on appearance (yellow teeth, bad breath), decreased physical stamina affecting activities, guilt, shame, and feelings of being controlled by the habit.',
        guidelines: 'Set a quit date, use nicotine replacement therapy (NRT) or medication, seek support from quitlines or support groups, avoid triggers.',
        whatToDo: 'Gradually reduce nicotine or quit cold turkey. Practice deep breathing exercises when cravings hit. Replace smoking with healthier habits like chewing gum or going for a walk. Inform friends and family about your decision to quit for support.'
      },
      'Social Media': {
        psychology: 'Social media apps are designed to be addictive, leveraging variable rewards (likes, comments) and fear of missing out (FOMO). They provide instant gratification and a sense of connection, often leading to compulsive checking and comparison, affecting self-esteem and mood.',
        physicalCons: 'Eye strain, headaches, poor posture, disturbed sleep patterns (blue light exposure), reduced physical activity.',
        mentalCons: 'Increased anxiety and depression (due to social comparison, cyberbullying), FOMO, reduced attention span, diminished critical thinking, narcissistic tendencies, sleep disturbances, impaired real-life social skills.',
        socialEmotionalCons: 'Reduced face-to-face interactions, strained relationships, feeling inadequate due to curated online portrayals, privacy concerns, waste of time, reduced productivity.',
        guidelines: 'Set screen time limits, turn off notifications, designate "no phone" times/areas, unfollow accounts that trigger negative feelings, engage in offline hobbies.',
        whatToDo: 'Use app timers. Create "tech-free" zones (e.g., bedroom). Practice mindful scrolling. Replace social media use with creative hobbies, reading, or direct social interaction. Regularly evaluate who you follow and why.'
      },
      'Mobile Addiction': {
        psychology: 'Driven by instant access to information, entertainment, and social connection. It creates a constant cycle of checking for notifications and new content, leading to a dopamine-driven feedback loop. Often used as a coping mechanism for boredom, stress, or loneliness.',
        physicalCons: 'Text neck, eye strain, headaches, carpal tunnel syndrome, disturbed sleep, reduced physical activity.',
        mentalCons: 'Anxiety (e.g., nomophobia - fear of being without your phone), reduced attention span, decreased productivity, sleep disturbances, irritability, difficulty focusing on complex tasks.',
        socialEmotionalCons: 'Impaired real-life communication, neglecting responsibilities (work, school, relationships), social isolation (even while "connected" online), reduced empathy, constant distraction, guilt, and self-blame.',
        guidelines: 'Implement screen time limits, use grayscale mode, charge phone away from bedroom, practice "digital Sabbath" days, engage in offline activities.',
        whatToDo: 'Identify specific apps that are addictive. Set strict time limits for each app. Turn off non-essential notifications. Put your phone away during meals or social gatherings. Find fulfilling offline hobbies.'
      },
      'Porn': {
        psychology: 'Highly stimulating content can lead to desensitization, creating a need for increasingly explicit or varied material to achieve satisfaction. It can distort perceptions of intimacy and relationships and is often used to cope with stress, loneliness, or sexual curiosity, leading to compulsive use.',
        physicalCons: 'Eye strain, disturbed sleep cycles (if consumed late at night), reduced energy levels, potential for sexual dysfunction (e.g., erectile dysfunction due to desensitization).',
        mentalCons: 'Shame, guilt, anxiety, depression, distorted sexual expectations, decreased satisfaction in real-life intimacy, compulsive usage, brain fog, reduced focus, and increased irritability.',
        socialEmotionalCons: 'Isolation, secrecy, strained romantic relationships, objectification of others, difficulty forming genuine connections, reduced empathy, impact on self-esteem, potential for legal issues if content involves minors or is illegal.',
        guidelines: 'Set clear boundaries, use content filters, seek professional counseling (therapist specializing in sexual health or addiction), engage in healthy sexual activity or intimacy with a partner, develop new hobbies.',
        whatToDo: 'Install content blockers on all devices. Remove triggers (e.g., specific websites, apps). Replace urges with alternative activities (exercise, creative pursuits). Seek support from a therapist specializing in compulsive sexual behaviors or a support group. Focus on building healthy relationships and self-worth.'
      },
      'Masturbation': {
        psychology: 'While healthy in moderation, excessive masturbation can become compulsive, particularly when used to cope with negative emotions like stress, boredom, or loneliness. It can lead to a desensitization effect, similar to porn, and interfere with daily life or real-life intimacy.',
        physicalCons: 'Exhaustion, reduced libido (in healthy context due to overstimulation), chafing/soreness, disturbed sleep patterns if done compulsively at night.',
        mentalCons: 'Shame, guilt, anxiety, compulsive urges, reduced focus, brain fog, irritability, distorted self-perception, interference with productivity and daily responsibilities.',
        socialEmotionalCons: 'Social isolation due to preference for solitary activity, avoiding real-life intimacy, neglecting social relationships, feelings of being controlled, impact on self-esteem.',
        guidelines: 'Understand healthy sexuality, set limits on frequency, identify triggers, replace urges with alternative activities, seek professional guidance if compulsive.',
        whatToDo: 'Recognize if it is compulsive and causing distress or impairment. Identify and avoid triggers (e.g., specific times, moods). Replace the urge with a healthy activity (exercise, journaling, connecting with friends). Focus on holistic well-being and building healthy coping mechanisms.'
      },
      'Drugs': {
        psychology: 'Drugs hijack the brain’s reward system, releasing large amounts of dopamine, leading to intense pleasure and powerful cravings. Tolerance develops quickly, requiring higher doses for the same effect, and dependence sets in. Addiction is a chronic brain disease affecting motivation, memory, and related circuitry.',
        physicalCons: 'Organ damage (liver, kidney, heart, brain), overdose risk, infectious diseases (HIV, hepatitis from needle sharing), malnutrition, dental problems, seizures, respiratory issues.',
        mentalCons: 'Severe mood swings, paranoia, psychosis, hallucinations, anxiety, depression, impaired cognitive function (memory, decision-making), increased risk of mental health disorders, severe dependence, and addiction.',
        socialEmotionalCons: 'Breakdown of family and social relationships, job loss, financial ruin, legal problems, homelessness, social isolation, loss of purpose, severe emotional distress, self-neglect, increased risk of violence and exploitation.',
        guidelines: 'Immediate professional help is crucial (detox, rehabilitation), support groups (NA, CA), therapy, address underlying mental health issues.',
        whatToDo: 'Seek immediate professional medical and psychological help. Do not attempt to quit cold turkey without medical supervision for certain substances due to severe withdrawal symptoms. Engage in therapy (CBT, motivational interviewing). Join support groups. Avoid all people, places, and things associated with drug use. Build a new, healthy life structure.'
      },
      'Unhealthy Eating': {
        psychology: 'Often triggered by emotional states (stress, boredom, sadness) or environmental cues (seeing fast food ads). It provides comfort, pleasure, and temporary emotional relief. Can be linked to reward pathways and become a compulsive habit, leading to weight gain and poor health.',
        physicalCons: 'Obesity, type 2 diabetes, heart disease, high blood pressure, high cholesterol, increased risk of certain cancers, joint problems, fatigue, digestive issues.',
        mentalCons: 'Body image issues, low self-esteem, depression, anxiety, guilt, shame, compulsive eating behaviors, disordered eating patterns, difficulty concentrating due to energy crashes.',
        socialEmotionalCons: 'Social anxiety related to food or body image, avoiding social gatherings involving food, financial drain, reduced participation in physical activities, emotional eating leading to a cycle of guilt and more unhealthy eating.',
        guidelines: 'Focus on balanced nutrition, mindful eating, meal planning, hydration, regular exercise, identifying emotional triggers, seeking support from dietitians or therapists.',
        whatToDo: 'Track your food intake and emotional triggers. Plan meals and snacks in advance. Focus on whole, unprocessed foods. Stay hydrated. Practice mindful eating (eat slowly, savor flavors). Address emotional eating with alternative coping strategies. Seek support from a nutritionist or therapist if needed.'
      },
      // Add more habits as needed
    };

    const getHabitContent = (habit) => {
      return habitDetails[habit] || {
        psychology: 'Information not available for this habit.',
        physicalCons: 'Information not available for this habit.',
        mentalCons: 'Information not available for this habit.',
        socialEmotionalCons: 'Information not available for this habit.',
        guidelines: 'General guidelines: Identify triggers, replace with healthier habits, seek support.',
        whatToDo: 'General action: Stay persistent, learn from setbacks, celebrate progress.'
      };
    };

    const handleGenerateInsight = async (habit) => {
      setIsLoadingInsight(true);
      setGeneratedInsight('');
      setSelectedHabitForInsight(habit); // Keep track of which habit we're generating for

      const prompt = `Provide detailed psychological insights, effective coping strategies, and actionable steps to overcome a habit like "${habit}". Focus on practical advice and a positive, empowering tone. Format the response clearly with headings for "Psychological Aspects," "Coping Strategies," and "Actionable Steps."`;

      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          const text = result.candidates[0].content.parts[0].text;
          setGeneratedInsight(text);
        } else {
          setGeneratedInsight("Failed to generate insights. Please try again.");
        }
      } catch (error) {
        console.error("Error generating insight:", error);
        setGeneratedInsight("An error occurred while generating insights. Please check your network connection.");
      } finally {
        setIsLoadingInsight(false);
      }
    };


    return (
      <div className="p-6 font-inter max-w-3xl mx-auto bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Education & Awareness</h1>
        <p className="text-center text-gray-600 mb-8">Understanding the science behind habits and recovery is crucial for lasting change.</p>

        {/* Section: How Habits Form */}
        <div className="bg-indigo-50 p-6 rounded-lg shadow-sm border border-indigo-200">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-3 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-indigo-600" />
            How Habits Form: The Habit Loop
          </h2>
          <p className="text-gray-800 leading-relaxed mb-4">
            Habits aren't just random acts; they're formed through a predictable cycle called the "Habit Loop." Understanding this loop is the first step to breaking free.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Cue:</strong> A trigger that tells your brain to go into automatic mode and which habit to use. (e.g., Stress, seeing a cigarette)</li>
            <li><strong>Craving:</strong> The anticipation of a reward that motivates you to act. (e.g., Desire for relief from stress, nicotine hit)</li>
            <li><strong>Response:</strong> The actual habit you perform. (e.g., Smoking, scrolling through social media)</li>
            <li><strong>Reward:</strong> The satisfying feeling or outcome your brain gets from the habit, reinforcing the loop. (e.g., Temporary calm, dopamine rush)</li>
          </ul>
        </div>

        {/* Section: Psychology of Bad Habits */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200">
          <h2 className="text-2xl font-semibold text-blue-700 mb-3 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-blue-600" />
            The Psychology Behind Your Habits
          </h2>
          <p className="text-gray-800 leading-relaxed mb-4">
            Understanding *why* we engage in bad habits, even when we know they're harmful, is crucial. It's often about unmet needs, emotional regulation, or learned coping mechanisms.
          </p>
          {habits.length > 0 ? (
            habits.map(habit => (
              <div key={`psy-${habit}`} className="mb-4 last:mb-0">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                  {habit}:
                </h3>
                <p className="text-gray-700 pl-6">{getHabitContent(habit).psychology}</p>
                <button
                    onClick={() => handleGenerateInsight(habit)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg text-sm mt-2 focus:outline-none focus:shadow-outline transform transition duration-200 hover:scale-105 flex items-center"
                    disabled={isLoadingInsight}
                >
                    {isLoadingInsight && selectedHabitForInsight === habit ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </span>
                    ) : (
                        <span>✨Generate More Insights✨</span>
                    )}
                </button>
                {isLoadingInsight && selectedHabitForInsight === habit && (
                    <p className="text-blue-500 text-sm mt-2">Generating personalized insights...</p>
                )}
                {generatedInsight && selectedHabitForInsight === habit && !isLoadingInsight && (
                    <div className="bg-blue-100 p-4 rounded-lg mt-4 shadow-sm border border-blue-300">
                        <h4 className="font-semibold text-blue-800 mb-2">Personalized Insights for {habit}:</h4>
                        <p className="text-gray-800 whitespace-pre-wrap">{generatedInsight}</p>
                    </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 italic pl-6">Select habits in onboarding to see specific psychological insights here.</p>
          )}
        </div>

        {/* Section: Consequences & Ill Effects */}
        <div className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-200">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-purple-600" />
            Consequences & Ill Effects
          </h2>
          <p className="text-gray-800 leading-relaxed mb-4">
            Be aware of the long-term impact of your habits on various aspects of your life.
          </p>
          {habits.length > 0 ? (
            habits.map(habit => {
              const content = getHabitContent(habit);
              return (
                <div key={`cons-${habit}`} className="mb-6 pb-4 border-b border-purple-300 last:border-b-0">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{habit}:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 pl-4">
                    <li><strong>Physical:</strong> {content.physicalCons}</li>
                    <li><strong>Mental:</strong> {content.mentalCons}</li>
                    <li><strong>Social & Emotional:</strong> {content.socialEmotionalCons}</li>
                  </ul>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600 italic">Select habits in onboarding to see specific consequences here.</p>
          )}
        </div>

        {/* Section: Guidelines & What to Do */}
        <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-200">
          <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
            <Target className="w-6 h-6 mr-2 text-green-600" />
            Guidelines & What to Do
          </h2>
          <p className="text-gray-800 leading-relaxed mb-4">
            Practical steps and strategies to help you on your recovery path.
          </p>
          {habits.length > 0 ? (
            habits.map(habit => {
              const content = getHabitContent(habit);
              return (
                <div key={`guide-${habit}`} className="mb-6 pb-4 border-b border-green-300 last:border-b-0">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{habit}:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 pl-4">
                    <li><strong>Guidelines:</strong> {content.guidelines}</li>
                    <li><strong>What to Do:</strong> {content.whatToDo}</li>
                  </ul>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600 italic">Select habits in onboarding to see personalized guidelines here.</p>
          )}
        </div>

        {/* Section: How to Break Them (retained from previous version) */}
        <div className="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200">
          <h2 className="text-2xl font-semibold text-yellow-700 mb-3 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-yellow-600" />
            How to Break Bad Habits: General Principles
          </h2>
          <p className="text-gray-800 leading-relaxed mb-4">
            Breaking a habit isn't about willpower alone; it's about re-engineering your habit loops.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Awareness:</strong> Identify your cues and cravings. What triggers your bad habit?</li>
            <li><strong>Trigger Management:</strong> Avoid or reframe your triggers.</li>
            <li><strong>Replacing Routines:</strong> Substitute the bad habit with a new, healthier response that provides a similar reward. (e.g., Instead of smoking, take a brisk walk)</li>
            <li><strong>Delayed Gratification:</strong> Train your brain to tolerate discomfort and delay instant rewards for greater long-term benefits.</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600 italic">"The chains of habit are too weak to be felt until they are too strong to be broken." - Samuel Johnson</p>
        </div>

        {/* Placeholder for more content types */}
        <div className="text-center text-gray-600 py-4 italic">
          More content, animated videos, and interactive exercises coming soon!
        </div>
      </div>
    );
  };

  // AI Mentor Component
  const AIMentor = ({ aiChatHistory, setAiChatHistory, userData }) => {
    const [input, setInput] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const aiName = "Nova"; // Give our AI a friendly name

    const handleSendMessage = async () => {
      if (input.trim() === '') return;

      const newUserMessage = { role: 'user', text: input };
      setAiChatHistory(prev => [...prev, newUserMessage]);
      setInput(''); // Clear input immediately
      setIsSendingMessage(true);

      // Map current chat history to the format expected by the Gemini API
      let chatHistoryForAPI = aiChatHistory.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
      // Add the new user message to the API payload
      chatHistoryForAPI.push({ role: "user", parts: [{ text: newUserMessage.text }] });

      const payload = { contents: chatHistoryForAPI };
      const apiKey = ""; // Canvas will provide this at runtime, leave as empty string
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          const aiResponseText = result.candidates[0].content.parts[0].text;
          setAiChatHistory(prev => [...prev, { role: 'ai', text: aiResponseText }]);
        } else {
          setAiChatHistory(prev => [...prev, { role: 'ai', text: `I'm sorry, I couldn't generate a response. Please try again.` }]);
        }
      } catch (error) {
        console.error("Error calling AI API:", error);
        setAiChatHistory(prev => [...prev, { role: 'ai', text: `I'm having trouble connecting right now, ${userData.name}. Please try again shortly.` }]);
      } finally {
        setIsSendingMessage(false);
      }
    };

    return (
      <div className="p-6 font-inter max-w-2xl mx-auto bg-white rounded-xl shadow-lg my-8 flex flex-col h-[600px]">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your AI Mentor, {aiName}</h1>
        <div className="flex-grow overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          {aiChatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
              <div className={`max-w-[75%] p-3 rounded-lg shadow-md ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-900 self-end' : 'bg-gray-200 text-gray-800 self-start'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isSendingMessage && (
            <div className="flex justify-start mb-3">
              <div className="max-w-[75%] p-3 rounded-lg shadow-md bg-gray-200 text-gray-800 self-start flex items-center">
                <svg className="animate-spin h-5 w-5 text-gray-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Typing...
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter' && !isSendingMessage) handleSendMessage(); }}
            className="flex-grow shadow appearance-none border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 mr-3"
            placeholder="Type your message..."
            disabled={isSendingMessage}
          />
          <button
            onClick={handleSendMessage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-200 hover:scale-105"
            disabled={isSendingMessage}
          >
            Send
          </button>
        </div>
      </div>
    );
  };

  // Activities & Tools Component
  const ActivitiesAndTools = () => {
    const activities = [
      {
        name: 'Guided Meditation',
        description: 'Find calm and focus with tailored meditation sessions for stress, cravings, and triggers. Explore various lengths and themes.',
        icon: '🧘‍♀️',
        action: () => alert('Starting a guided meditation (placeholder)...')
      },
      {
        name: 'Exercise Routines',
        description: 'Boost your energy and mood with quick 10-minute energizers or full workout plans. Movement is medicine!',
        icon: '🏋️‍♂️',
        action: () => alert('Starting an exercise routine (placeholder)...')
      },
      {
        name: 'Reading Suggestions',
        description: 'Dive into insightful short reads, motivational books, or classic recovery literature to inspire your journey.',
        icon: '📚',
        action: () => alert('Opening reading suggestions (placeholder)...')
      },
      {
        name: 'Journaling & Reflection',
        description: 'Explore prompts for self-reflection, track your moods, and process your thoughts and feelings. Your personal space.',
        icon: '✍️',
        action: () => alert('Opening journaling prompts (placeholder)...')
      },
      {
        name: 'Goal Visualization',
        description: 'Visualize your success and reinforce your commitment. See yourself achieving your goals!',
        icon: '🎯',
        action: () => alert('Starting goal visualization (placeholder)...')
      },
      {
        name: 'Gratitude Practice',
        description: 'Shift your perspective by focusing on what you\'re thankful for each day.',
        icon: '🙏',
        action: () => alert('Starting gratitude practice (placeholder)...')
      },
      {
        name: 'Creative Outlets',
        description: 'Express yourself through music, drawing, poetry, or any other creative pursuit. Unleash your inner artist!',
        icon: '🎨',
        action: () => alert('Exploring creative outlets (placeholder)...')
      },
      {
        name: 'Offline Time Challenges',
        description: 'Disconnect from screens and reconnect with the real world. Challenge yourself to digital detox periods.',
        icon: '📵',
        action: () => alert('Starting an offline time challenge (placeholder)...')
      },
    ];

    return (
      <div className="p-6 font-inter max-w-3xl mx-auto bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Activities & Tools to Replace Bad Habits</h1>
        <p className="text-center text-gray-600 mb-8">Engage in positive activities to re-wire your brain and build new, healthy routines.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((activity, index) => (
            <div key={index} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 flex items-start space-x-4">
              <div className="text-4xl">{activity.icon}</div>
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{activity.name}</h2>
                <p className="text-gray-700">{activity.description}</p>
                <button
                  onClick={activity.action}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2"
                >
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-gray-600 py-6 italic">
          New activities and personalized recommendations based on your profile coming soon!
        </div>
      </div>
    );
  };

  // Music & Mindspace Component
  const MusicAndMindspace = () => {
    const playlists = [
      { name: 'Calm & Relax', description: 'Soothing sounds for peace and tranquility.', icon: '🌸' },
      { name: 'Focus & Productivity', description: 'Background tunes to help you concentrate.', icon: '🧠' },
      { name: 'Motivation Boost', description: 'Uplifting tracks to keep you going.', icon: '🚀', action: () => alert('Playing Motivational Boost playlist!') },
      { name: 'Sleep Aid', description: 'Gentle melodies to drift off to dreamland.', icon: '😴' },
      { name: 'Detox Mode', description: 'Sounds to help cleanse and reset your mind.', icon: '✨' },
      { name: 'Nature & Ambient Sounds', description: 'Immerse yourself in natural soundscapes.', icon: '🌳' },
    ];

    const [currentPlaying, setCurrentPlaying] = useState(null);

    const handlePlay = (playlistName) => {
      setCurrentPlaying(playlistName);
      alert(`Playing: ${playlistName} (Note: Actual music playback is not implemented in this demo)`); // Placeholder alert
    };

    return (
      <div className="p-6 font-inter max-w-3xl mx-auto bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Music & Mindspace</h1>
        <p className="text-center text-gray-600 mb-8">Curated playlists to support your mental state and enhance your recovery journey.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {playlists.map((playlist, index) => (
            <div key={index} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 flex items-start space-x-4">
              <div className="text-4xl">{playlist.icon}</div>
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{playlist.name}</h2>
                <p className="text-gray-700">{playlist.description}</p>
                <button
                  onClick={() => handlePlay(playlist.name)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg shadow transform transition duration-200 hover:scale-105 text-sm mt-2"
                >
                  {currentPlaying === playlist.name ? 'Playing...' : 'Play Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-purple-50 p-6 rounded-lg shadow-inner border border-purple-200">
          <h2 className="text-2xl font-semibold text-purple-700 mb-3 flex items-center">
            <Music className="w-6 h-6 mr-2 text-purple-600" />
            Background Sounds
          </h2>
          <p className="text-gray-800 mb-4">
            Enhance your journaling or meditation sessions with ambient background sounds.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="bg-purple-200 hover:bg-purple-300 text-purple-800 py-2 px-4 rounded-lg text-sm transition duration-200">Rain Sounds</button>
            <button className="bg-purple-200 hover:bg-purple-300 text-purple-800 py-2 px-4 rounded-lg text-sm transition duration-200">Ocean Waves</button>
            <button className="bg-purple-200 hover:bg-purple-300 text-purple-800 py-2 px-4 rounded-lg text-sm transition duration-200">Forest Ambiance</button>
            <button className="bg-purple-200 hover:bg-purple-300 text-purple-800 py-2 px-4 rounded-lg text-sm transition duration-200">Campfire Crackle</button>
          </div>
          <p className="text-sm text-gray-600 mt-4 italic"> (Actual sound playback not implemented) </p>
        </div>
      </div>
    );
  };

  // Trigger Blocker Component
  const TriggerBlocker = () => {
    const [blockedApps, setBlockedApps] = useState(['Social Media Apps', 'Gaming Sites', 'Streaming Services']);
    const [newApp, setNewApp] = useState('');
    const [lockdownDuration, setLockdownDuration] = useState('1');

    const handleAddBlockedApp = () => {
      if (newApp.trim() && !blockedApps.includes(newApp.trim())) {
        setBlockedApps([...blockedApps, newApp.trim()]);
        setNewApp('');
      }
    };

    const handleRemoveBlockedApp = (appToRemove) => {
      setBlockedApps(blockedApps.filter(app => app !== appToRemove));
    };

    const handleLockdown = () => {
      alert(`Emergency Lockdown Mode activated for ${lockdownDuration} hour(s)! (Note: This is a placeholder for actual blocking functionality.)`);
    };

    return (
      <div className="p-6 font-inter max-w-2xl mx-auto bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Trigger Blocker</h1>
        <p className="text-center text-gray-600 mb-8">Manage temptations by setting limits and blocking access to specific apps or websites.</p>

        {/* Blocked Apps/Websites */}
        <div className="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200 mb-8">
          <h2 className="text-2xl font-semibold text-red-700 mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-red-600" />
            Blocked Apps/Websites
          </h2>
          <div className="mb-4 flex">
            <input
              type="text"
              value={newApp}
              onChange={(e) => setNewApp(e.target.value)}
              className="flex-grow shadow appearance-none border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 mr-2"
              placeholder="Add app/website to block"
            />
            <button
              onClick={handleAddBlockedApp}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {blockedApps.map((app, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                {app}
                <button onClick={() => handleRemoveBlockedApp(app)} className="ml-2 text-red-600 hover:text-red-900">
                  &times;
                </button>
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4 italic">
            (Note: Actual app/website blocking functionality requires device permissions and is not implemented in this demo.)
          </p>
        </div>

        {/* Emergency Lockdown Mode */}
        <div className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-200">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-purple-600" />
            Emergency Lockdown Mode
          </h2>
          <p className="text-gray-800 mb-4">
            Need an urgent break? Activate Lockdown Mode to temporarily block all identified triggers.
          </p>
          <div className="flex items-center mb-4">
            <label htmlFor="lockdownDuration" className="mr-3 text-gray-700 font-medium">Duration:</label>
            <select
              id="lockdownDuration"
              value={lockdownDuration}
              onChange={(e) => setLockdownDuration(e.target.value)}
              className="shadow border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
            >
              {[...Array(12).keys()].map(i => (
                <option key={i + 1} value={i + 1}>{i + 1} Hour{i + 1 > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleLockdown}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transform transition duration-200 hover:scale-105"
          >
            Activate Lockdown
          </button>
          <p className="text-sm text-gray-600 mt-4 italic">
            Notifications like: "Take a breath. Let's pause together." would appear during lockdown.
          </p>
        </div>
      </div>
    );
  };

  // Community & Support Component
  const CommunityAndSupport = () => {
    return (
      <div className="p-6 font-inter max-w-2xl mx-auto bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Community & Support</h1>
        <p className="text-center text-gray-600 mb-8">Connect with others on similar journeys. Share, learn, and grow together in a safe, supportive space.</p>

        <div className="space-y-6">
          {/* Anonymous Community */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-600" />
              Anonymous Community Forum
            </h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              Share your wins, challenges, and encouragement without judgment. Your privacy is paramount.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transform transition duration-200 hover:scale-105">
              Join the Forum
            </button>
            <p className="text-sm text-gray-600 mt-3 italic"> (Forum functionality not implemented in this demo) </p>
          </div>

          {/* Group Challenges */}
          <div className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-200">
            <h2 className="text-2xl font-semibold text-purple-700 mb-3 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-purple-600" />
              Group Challenges
            </h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              Participate in guided challenges like "7-day dopamine detox" or "30-day no-smoking" with a supportive group.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>7-day Dopamine Detox</li>
              <li>30-day No-Smoking Challenge</li>
              <li>21-day Digital Well-being Quest</li>
            </ul>
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transform transition duration-200 hover:scale-105">
              View Challenges
            </button>
            <p className="text-sm text-gray-600 mt-3 italic"> (Challenge tracking not implemented in this demo) </p>
          </div>

          {/* AI-Moderated Group Chats */}
          <div className="bg-indigo-50 p-6 rounded-lg shadow-sm border border-indigo-200">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-indigo-600" />
              AI-Moderated Group Chats
            </h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              Engage in real-time conversations with other users in a safe environment, supported by AI moderation.
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transform transition duration-200 hover:scale-105">
              Join a Chat
            </button>
            <p className="text-sm text-gray-600 mt-3 italic"> (Chat functionality not implemented in this demo) </p>
          </div>
        </div>
      </div>
    );
  };

  // Mindset Development & Therapy Support Component
  const MindsetDevelopment = () => {
    return (
      <div className="p-6 font-inter max-w-3xl mx-auto bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Mindset Development & Therapy Support</h1>
        <p className="text-center text-gray-600 mb-8">Strengthen your mental resilience and explore professional support when needed.</p>

        <div className="space-y-6">
          {/* CBT-based Exercises */}
          <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-200">
            <h2 className="text-2xl font-semibold text-green-700 mb-3 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-green-600" />
              CBT-based Exercises
            </h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              Learn to identify and challenge unhelpful thought patterns with Cognitive Behavioral Therapy (CBT) techniques.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Thought Records</li>
              <li>Behavioral Activation</li>
              <li>Mindfulness for Anxiety</li>
            </ul>
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transform transition duration-200 hover:scale-105">
              Start Exercises
            </button>
            <p className="text-sm text-gray-600 mt-3 italic"> (Exercises are illustrative, not interactive in this demo) </p>
          </div>

          {/* Self-Compassion & Self-Forgiveness */}
          <div className="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200">
            <h2 className="text-2xl font-semibold text-yellow-700 mb-3 flex items-center">
              <Target className="w-6 h-6 mr-2 text-yellow-600" />
              Self-Compassion & Self-Forgiveness
            </h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              Cultivate kindness towards yourself and learn to let go of past mistakes. This is a journey, not a punishment.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Guided Self-Compassion Meditations</li>
              <li>Forgiveness Journaling Prompts</li>
            </ul>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transform transition duration-200 hover:scale-105">
              Explore Resources
            </button>
            <p className="text-sm text-gray-600 mt-3 italic"> (Resources are illustrative, not interactive in this demo) </p>
          </div>

          {/* Referrals to Professional Help */}
          <div className="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200">
            <h2 className="text-2xl font-semibold text-red-700 mb-3 flex items-center">
              <User className="w-6 h-6 mr-2 text-red-600" />
              Professional Support
            </h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              For comprehensive support, we can help you find referrals to licensed therapists, support groups, and crisis hotlines.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transform transition duration-200 hover:scale-105">
              Find Support
            </button>
            <p className="text-sm text-gray-600 mt-3 italic"> (Referral system not implemented in this demo) </p>
          </div>
        </div>
      </div>
    );
  };

  // Badges Component
  const Badges = ({ points, habitStreaks }) => {
    const allBadges = [
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
    ];

    const checkIfEarned = (badge) => {
      if (badge.threshold !== null) {
        return points >= badge.threshold;
      }
      if (badge.condition) {
        // This is a simplified check. A real app would track more granular activity completion.
        // For streak-based badges, we check against current habit streaks.
        if (badge.name.includes('Streak') || badge.name.includes('Consistent')) {
            return badge.condition(habitStreaks);
        }
        return false; // For other conditions, placeholder for now
      }
      return false;
    };


    return (
      <div className="p-6 font-inter max-w-3xl mx-auto bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
          <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
          Your Badges
        </h1>
        <p className="text-center text-gray-600 mb-8">Earn these badges as you progress on your journey!</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {allBadges.map((badge, index) => {
            const earned = checkIfEarned(badge);
            return (
              <div
                key={index}
                className={`p-5 rounded-xl shadow-md border-2 transition-all duration-300 transform hover:scale-105
                  ${earned ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400' : 'bg-gray-50 border-gray-200 opacity-60'}`}
              >
                <div className="text-5xl text-center mb-3">{badge.icon}</div>
                <h3 className="text-xl font-semibold text-center mb-2 text-gray-900">{badge.name}</h3>
                <p className="text-center text-gray-700 text-sm mb-3">{badge.description}</p>
                {badge.threshold !== null && (
                  <p className="text-center text-gray-500 text-xs">Requires: {badge.threshold} points</p>
                )}
                <div className="text-center mt-3">
                  {earned ? (
                    <span className="text-green-600 font-bold text-sm">EARNED!</span>
                  ) : (
                    <span className="text-gray-500 text-sm">Not yet earned</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-gray-600 py-6 italic">
          More badges and dynamic tracking coming soon!
        </p>
      </div>
    );
  };


  // Main App Render Logic
  return (
    <div className="min-h-screen bg-gray-100 font-inter text-gray-800 flex flex-col">
      {/* Header and Navigation (visible after onboarding) */}
      {currentView !== 'onboarding' && (
        <header className="bg-white shadow-md p-4 sticky top-0 z-10">
          <nav className="flex justify-around items-center max-w-4xl mx-auto">
            <button onClick={() => setCurrentView('dashboard')} className="nav-icon-button">
              <Home /> <span className="hidden sm:inline">Home</span>
            </button>
            <button onClick={() => setCurrentView('habitTracker')} className="nav-icon-button">
              <Activity /> <span className="hidden sm:inline">Tracker</span>
            </button>
            <button onClick={() => setCurrentView('aiMentor')} className="nav-icon-button">
              <Brain /> <span className="hidden sm:inline">AI Mentor</span>
            </button>
            <button onClick={() => setCurrentView('education')} className="nav-icon-button">
              <BookOpen /> <span className="hidden sm:inline">Education</span>
            </button>
            <button onClick={() => setCurrentView('music')} className="nav-icon-button">
              <Music /> <span className="hidden sm:inline">Music</span>
            </button>
            <button onClick={() => setCurrentView('badges')} className="nav-icon-button">
              <Trophy /> <span className="hidden sm:inline">Badges</span>
            </button>
          </nav>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentView === 'onboarding' && (
          <Onboarding
            userData={userData}
            setUserData={setUserData}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === 'dashboard' && userData.name && (
          <Dashboard
            userData={userData}
            points={points}
            habitStreaks={habitStreaks}
            setCurrentView={setCurrentView}
            handleLogUrge={handleLogUrge}
            loggedUrges={loggedUrges}
            motivationQuote={motivationQuote}
            plantStage={plantStage}
            plantGrowthPercentage={plantGrowthPercentage}
            plantDryReason={plantDryReason}
          />
        )}
        {currentView === 'habitTracker' && (
          <HabitTracker
            habits={userData.habits}
            habitStreaks={habitStreaks}
            handleHabitCheckIn={handleHabitCheckIn}
            handleStreakBreak={handleStreakBreak}
            dailyActivityCompletion={dailyActivityCompletion}
            handleActivityCompletion={handleActivityCompletion}
          />
        )}
        {currentView === 'education' && (
          <EducationModule userData={userData} />
        )}
        {currentView === 'aiMentor' && (
          <AIMentor
            aiChatHistory={aiChatHistory}
            setAiChatHistory={setAiChatHistory}
            userData={userData}
          />
        )}
        {currentView === 'activities' && (
          <ActivitiesAndTools />
        )}
        {currentView === 'music' && (
          <MusicAndMindspace />
        )}
        {currentView === 'triggerBlocker' && (
          <TriggerBlocker />
        )}
        {currentView === 'community' && (
          <CommunityAndSupport />
        )}
        {currentView === 'mindset' && (
          <MindsetDevelopment />
        )}
        {currentView === 'badges' && (
          <Badges points={points} habitStreaks={habitStreaks} />
        )}
        {/* Add more views here as needed */}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        Sankalp – A Journey of Change by Pranav Singh Visen
      </footer>

      {/* Tailwind CSS Styling */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          background-color: #f3f4f6; /* Light gray background */
        }
        .dashboard-button {
          @apply bg-white p-4 rounded-xl shadow-md flex flex-col items-center justify-center text-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition duration-200 transform hover:scale-105 border border-gray-200;
        }
        .nav-icon-button {
          @apply flex flex-col items-center text-gray-600 hover:text-indigo-600 p-2 rounded-lg transition-colors duration-200 text-sm font-medium;
        }
        .nav-icon-button svg {
            @apply w-6 h-6 mb-1;
        }
      `}</style>
    </div>
  );
}

export default App;
