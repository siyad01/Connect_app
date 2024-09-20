import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserData } from '../context/userContext';
import { LoadingAnimation } from '../components/Loading';

const Register = () => {
  const [step, setStep] = useState(1); // Track the current step
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [backgroundPicture, setBackgroundPicture] = useState(null);
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");

  const navigate = useNavigate();
  const { registerUser, btnLoading } = UserData();

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step - 1);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilePicture", profilePicture);
    formData.append("backgroundPicture", backgroundPicture);
    formData.append("tagline", tagline);
    formData.append("bio", bio);
    
    registerUser(formData, navigate);
  };

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img src='/images/logo.svg' alt='Connect' className='h-16' />
        </div>
        <h2 className='text-2xl font-semibold text-center mb-6'>
          Join <span className='text-white bg-[#FFA904] p-1 rounded-md shadow-7xl text-md font-bold'>
            Connect
          </span> : Build Your Professional Network Today
        </h2>

        <form onSubmit={submitHandler}>
          {step === 1 && (
            <div>
              <div className="flex space-x-6">
                <div className="mb-4">
                  <label htmlFor="firstName" className='flex text-sm font-medium text-gray-700'>FirstName</label>
                  <input type="text" id='firstName' className='name-input' value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label htmlFor="lastName" className='flex text-sm font-medium text-gray-700'>LastName</label>
                  <input type="text" id='lastName' className='name-input' value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="email" className='block text-sm font-medium text-gray-700'>Email</label>
                <input type="email" id='email' className='common-input' value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className='block text-sm font-medium text-gray-700'>Password</label>
                <input type="password" id='password' className='common-input' value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type='button' onClick={handleNextStep} className='common-btn mt-1'>
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-4">
                <label htmlFor="profilePicture" className='block text-sm font-medium text-gray-700'>Profile Picture</label>
                <input type="file" id='profilePicture' accept="image/*" onChange={(e) => handleFileChange(e, setProfilePicture)} />
              </div>
              <div className="mb-4">
                <label htmlFor="backgroundPicture" className='block text-sm font-medium text-gray-700'>Background Picture</label>
                <input type="file" id='backgroundPicture' accept="image/*" onChange={(e) => handleFileChange(e, setBackgroundPicture)} />
              </div>
              <div className="mb-4">
                <label htmlFor="tagline" className='block text-sm font-medium text-gray-700'>Tagline</label>
                <input type="text" id='tagline' className='common-input' value={tagline} onChange={(e) => setTagline(e.target.value)} />
              </div>
              <div className="mb-4">
                <label htmlFor="bio" className='block text-sm font-medium text-gray-700'>Bio</label>
                <textarea id='bio' className='common-input' value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <div className="flex justify-between">
                <button type='button' onClick={handlePrevStep} className='common-btn'>
                  Previous
                </button>
                <button type='button' onClick={handleNextStep} className='common-btn'>
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Review Your Information</h3>
              <p><strong>First Name:</strong> {firstName}</p>
              <p><strong>Last Name:</strong> {lastName}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Tagline:</strong> {tagline}</p>
              <p><strong>Bio:</strong> {bio}</p>
              <div className="flex justify-between mt-4 space-x-4">
                <button type='button' onClick={handlePrevStep} className='common-btns'>
                  Previous
                </button>
                <button type='submit' className='common-btns' disabled={btnLoading}>
                  {btnLoading ? <LoadingAnimation /> : "Submit"}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className='bg-white px-2 to-gray-500'>or</span>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            <span>Already have an account? <Link to="/login" className='font-medium hover:underline hover:text-[#FFA904]'>Login</Link></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
