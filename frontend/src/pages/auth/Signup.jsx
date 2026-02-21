import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleCard from '../../components/common/RoleCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: selectedRole
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate(selectedRole === 'student' ? '/student/dashboard' : '/instructor/dashboard');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {step === 1 ? (
          <div>
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-3">Create Account</h1>
            <p className="text-center text-gray-600 mb-10">Select your role to get started</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <RoleCard
                role="Student"
                icon="🎓"
                description="Learn from expert instructors and grow your skills"
                onClick={() => handleRoleSelect('student')}
              />
              <RoleCard
                role="Instructor"
                icon="👨‍🏫"
                description="Share your knowledge and teach students worldwide"
                onClick={() => handleRoleSelect('instructor')}
              />
            </div>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="text-yellow-600 font-semibold hover:underline">
                  Login here
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
            <button
              onClick={() => setStep(1)}
              className="text-gray-600 hover:text-gray-800 mb-4 flex items-center"
            >
              ← Back to role selection
            </button>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Register as {selectedRole}</h2>
            <p className="text-gray-600 mb-6">Fill in your details to create your account</p>

            <form onSubmit={handleSubmit}>
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
              
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                required
              />
              
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                required
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
              
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />

              <Button type="submit" className="w-full mt-6">
                Create Account
              </Button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-yellow-600 font-semibold hover:underline">
                Login here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
