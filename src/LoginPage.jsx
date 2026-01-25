import { useState, useRef } from 'react'
import windowsStartBg from './assets/windows_start.png'
import profilePicture from './assets/profile_picture.png'
import windowsOpeningSound from './assets/windows_opening.mp3'
import clickSound from './assets/click.mp3'
import keyboardSound from './assets/keyboard.mp3'

function LoginPage({ onLogin, onLogout }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showLogoutMenu, setShowLogoutMenu] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [bgImageLoaded, setBgImageLoaded] = useState(false)
  const windowsAudioRef = useRef(null)
  const clickAudioRef = useRef(null)
  const keyboardAudioRef = useRef(null)
  const hasPlayedSound = useRef(false)

  // Play Windows opening sound on first page interaction
  const playWindowsSound = () => {
    if (!hasPlayedSound.current && windowsAudioRef.current) {
      windowsAudioRef.current.play().catch((err) => {
        console.log('Could not play sound:', err)
      })
      hasPlayedSound.current = true
    }
  }

  // Play click sound after first interaction (but not while windows sound is playing)
  const playClickSound = () => {
    if (hasPlayedSound.current && clickAudioRef.current) {
      const windowsAudio = windowsAudioRef.current
      // Don't play click if windows sound is still playing
      if (windowsAudio && !windowsAudio.paused && windowsAudio.currentTime < windowsAudio.duration - 0.1) {
        return
      }
      clickAudioRef.current.currentTime = 0
      clickAudioRef.current.play().catch((err) => {
        console.log('Could not play click sound:', err)
      })
    }
  }

  // Handle click anywhere on page
  const handlePageClick = (e) => {
    playWindowsSound()
  }

  // Handle key press for sound
  const handleKeyPress = (e) => {
    playWindowsSound()
    playClickSound()
  }

  // Play keyboard sound when typing password
  const playKeyboardSound = () => {
    if (keyboardAudioRef.current) {
      keyboardAudioRef.current.currentTime = 0
      keyboardAudioRef.current.play().catch((err) => {
        console.log('Could not play keyboard sound:', err)
      })
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate login delay for realistic feel
    setTimeout(() => {
      // Case-insensitive password check
      if (password.toLowerCase() === 'michonne') {
        setIsLoading(false)
        onLogin()
      } else {
        setError('The password is incorrect. Frankly, quite disappointed in you edward')
        setPassword('')
        setIsLoading(false)
      }
    }, 500)
  }

  return (
    <div
      style={{
        backgroundImage: `url(${windowsStartBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        cursor: 'pointer',
        backgroundColor: '#0000aa'
      }}
      onClick={handlePageClick}
    >
      <audio ref={windowsAudioRef} src={windowsOpeningSound} />
      <audio ref={clickAudioRef} src={clickSound} />
      <audio ref={keyboardAudioRef} src={keyboardSound} />

      {/* Hidden img element to track when background image loads */}
      <img src={windowsStartBg} onLoad={() => setBgImageLoaded(true)} style={{ display: 'none' }} />

      {/* Loading Message */}
      {!bgImageLoaded && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ffff00',
            fontSize: '24px',
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          fontWeight: 'bold',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 9999
        }}
      >
        Wait for bg image to load before clicking anything!
      </div>
      )}

      {/* Windows Version - Bottom Left */}
      <div
        style={{
          position: 'fixed',
          bottom: '12px',
          left: '12px',
          color: 'white',
          fontSize: '11px',
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          opacity: 0.7,
          pointerEvents: 'none'
        }}
      >
        Windows 10
        <br />
        Version 22H2
      </div>

      {/* Login Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '30px',
          padding: '40px'
        }}
      >
        {/* Profile Picture */}
        <img
          src={profilePicture}
          alt="Profile"
          style={{
            width: '128px',
            height: '128px',
            borderRadius: '50%',
            backgroundColor: '#6b7280',
            border: '3px solid rgba(255, 255, 255, 0.2)',
            objectFit: 'cover'
          }}
        />

        {/* Username */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: '300',
            color: 'white',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            letterSpacing: '0.5px'
          }}
        >
          STR4HM
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '280px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Username Field (display only) */}
          <input
            type="text"
            value="STR4HM"
            disabled
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              color: 'white',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              fontSize: '14px',
              outline: 'none',
              cursor: 'not-allowed'
            }}
          />

          {/* Password Field */}
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              onKeyPress={handleKeyPress}
              onClick={handlePageClick}
              placeholder="Password"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: 'white',
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s'
              }}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              onClick={() => {
                playWindowsSound()
                playClickSound()
              }}
              style={{
                position: 'absolute',
                right: '4px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '20px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isLoading ? 0.5 : 1,
                transition: 'color 0.2s',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.color = 'rgba(255, 255, 255, 0.9)'
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.6)'
              }}
              title="Sign in"
            >
              →
            </button>
          </div>

          {/* Error Message */}
          <div style={{ height: '20px', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {error && (
              <div
                style={{
                  color: '#f06666',
                  fontSize: '13px',
                  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                  textAlign: 'center'
                }}
              >
                {error}
              </div>
            )}
          </div>
        </form>

        {/* Password Hint Section */}
        <div style={{ height: '52px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: '8px' }}>
          <button
            onClick={() => {
              playClickSound()
              setShowHint(!showHint)
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '13px',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'color 0.2s',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.9)'
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.6)'
            }}
          >
            Password hint
          </button>

          {/* Hint Message */}
          {showHint && (
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '13px',
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                textAlign: 'center'
              }}
            >
              You sure you don't know?
            </div>
          )}
        </div>
      </div>

      {/* Bottom Left Profile & Logout */}


      {/* Bottom Right Icons */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          gap: '20px',
          color: 'white',
          fontSize: '24px'
        }}
      >
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '8px',
            outline: 'none'
          }}
          title="Ease of access"
        >
          ⚙️
        </button>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '8px',
            outline: 'none'
          }}
          title="Keyboard accessibility"
        >
          ⌨️
        </button>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '8px',
            outline: 'none'
          }}
          title="Power"
        >
          ⏻
        </button>
      </div>
    </div>
  )
}

export default LoginPage
