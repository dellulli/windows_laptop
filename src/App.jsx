import { useEffect, useRef, useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'
import LoginPage from './LoginPage'

// App title constant
const APP_TITLE = "Edward's Windows Laptop"

// Capture notification messages
const CAPTURE_MESSAGES = [
  "Mogged",
  "Michonne approved ✔",
  "Michonne loves 😍",
  "aura maxxing",
  "ateee 💅"
]

import kissImg from './assets/michonne_kiss.png'
import bgImage from './assets/bg.png'
import clickSound from './assets/click.mp3'
import cameraSnapSound from './assets/camera_snap.mp3'
import windowsOpeningSound from './assets/windows_opening.mp3'
import musicFile from './assets/music.mp3'
import musicFile2 from './assets/music2.mp3'
import musicFile3 from './assets/music3.mp3'
import musicFile4 from './assets/music4.mp3'
import musicFile5 from './assets/music5.mp3'
import musicFile6 from './assets/music6.mp3'
import musicFile7 from './assets/music7.mp3'
import cursorImg from './assets/cursor.svg'
import emptyBinImg from './assets/empty_bin.webp'
import fullBinImg from './assets/Recycle_bin_full.webp'
import trashSound from './assets/trash.mp3'
import heartFilterImg from './assets/heart_filter.png'
import armpitImg from './assets/armpit.png'
import septumImg from './assets/septum.png'
import eyebrowImg from './assets/eyebrow.png'
import lipImg from './assets/lip.png'
import labretImg from './assets/chin.png'
import noseStudImg from './assets/nose_stud.png'
import spikeImg from './assets/spike.png'
import bridgeImg from './assets/spike.png' // TODO: Replace with bridge.png when available
import studImg from './assets/stud.png'
import profilePicture from './assets/profile_picture.png'
import windowsStartImg from './assets/windows_start.png'
import letterboxdLogo from './assets/letterboxd_logo.png'
import purblePalaceLogo from './assets/purble_palace.png'
import music1Cover from './assets/music_covers/music1.jpg'
import music2Cover from './assets/music_covers/music2.jpg'
import music3Cover from './assets/music_covers/music3.png'
import music4Cover from './assets/music_covers/music4.jpg'
import music5Cover from './assets/music_covers/music5.jpg'
import music6Cover from './assets/music_covers/music6.jpg'
import music7Cover from './assets/music_covers/music7.png'

// Playlist data
const PLAYLIST = [
  {
    title: 'I Really Want To Stay At Your House',
    file: musicFile
  },
  {
    title: 'Lover, You Should\'ve Come Over',
    file: musicFile2
  },
  {
    title: 'Jigsaw Falling Into Place',
    file: musicFile3
  },
  {
    title: 'I Lied To You',
    file: musicFile4
  },
  {
    title: 'Whistle Song',
    file: musicFile5
  },
  {
    title: 'Lovetripper',
    file: musicFile6
  },
  {
    title: 'Bojack\'s Theme',
    file: musicFile7
  }
]
import './App.css'

// Music cover images array
const MUSIC_COVERS = [music1Cover, music2Cover, music3Cover, music4Cover, music5Cover, music6Cover, music7Cover]

function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayImageRef = useRef(null)
  const heartFilterRef = useRef(null)
  const bloodSplatterRef = useRef(null)
  const borderRef = useRef(null)
  const septumRef = useRef(null)
  const eyebrowRef = useRef(null)
  const lipRef = useRef(null)
  const labretRef = useRef(null)
  const noseStudRef = useRef(null)
  const spikeRef = useRef(null)
  const bridgeRef = useRef(null)
  const eyeGemRef = useRef(null)
  const faceLandmarkerRef = useRef(null)
  const animationIdRef = useRef(null)
  const clickAudioRef = useRef(null)
  const trashAudioRef = useRef(null)
  const cameraSnapAudioRef = useRef(null)
  const windowsOpeningAudioRef = useRef(null)
  const imageCountRef = useRef(0)
  const captureCounterRef = useRef(0)  // Tracks total captures ever made (never decreases)
  const musicSliderRef = useRef(null)
  const frameCounterRef = useRef(0)  // Tracks frame number for animated grain
  const isCapturingRef = useRef(false)  // Prevent concurrent captures
  const piercingAdjustmentsRef = useRef({})

  // State for overlay positioning
  const [offsetX, setOffsetX] = useState(() => {
    const saved = localStorage.getItem('michonneOffsetX')
    return saved !== null ? Number(saved) : -27
  })
  const [offsetY, setOffsetY] = useState(() => {
    const saved = localStorage.getItem('michonneOffsetY')
    return saved !== null ? Number(saved) : -84
  })
  const [scale, setScale] = useState(() => {
    const saved = localStorage.getItem('michonneScale')
    return saved !== null ? Number(saved) : 0.7
  })
  const [rotation, setRotation] = useState(() => {
    const saved = localStorage.getItem('michonneRotation')
    return saved !== null ? Number(saved) : 0
  })
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [showAbout, setShowAbout] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showDesktop, setShowDesktop] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [capturedImages, setCapturedImages] = useState([])
  const [imageCount, setImageCount] = useState(0)
  const [showDownloadsFolder, setShowDownloadsFolder] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedTrashImage, setSelectedTrashImage] = useState(null)
  const [imageToDelete, setImageToDelete] = useState(null)
  const [downloadsPage, setDownloadsPage] = useState(0)
  const [trashPage, setTrashPage] = useState(0)
  const [piercingPage, setPiercingPage] = useState(0)
  const [addOnPage, setAddOnPage] = useState(0)
  const [showPiercingControls, setShowPiercingControls] = useState(false)
  const [piercingAdjustments, setPiercingAdjustments] = useState(() => {
    const saved = localStorage.getItem('piercingAdjustments')
    const parsed = saved ? JSON.parse(saved) : {}
    // Set eye gem defaults if not already set
    if (!parsed.hasOwnProperty('piercing_eyeGem_offsetX')) parsed['piercing_eyeGem_offsetX'] = 0
    if (!parsed.hasOwnProperty('piercing_eyeGem_offsetY')) parsed['piercing_eyeGem_offsetY'] = -20
    if (!parsed.hasOwnProperty('piercing_eyeGem_scale')) parsed['piercing_eyeGem_scale'] = 1.9
    return parsed
  })
  const [captureNotification, setCaptureNotification] = useState(null)
  const [captureMessageIndex, setCaptureMessageIndex] = useState(0)
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)
  const [isMusciPlaying, setIsMusicPlaying] = useState(false)
  const [showKissCam, setShowKissCam] = useState(false)
  const [showPurplePalace, setShowPurplePalace] = useState(false)
  const [trashedImages, setTrashedImages] = useState([])
  const [showTrash, setShowTrash] = useState(false)
  const [imageToDeletePermanently, setImageToDeletePermanently] = useState(null)
  const [confirmClearTrash, setConfirmClearTrash] = useState(false)
  const [showSaveOptions, setShowSaveOptions] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(0)
  const [isDraggingSlider, setIsDraggingSlider] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [replayCurrentSong, setReplayCurrentSong] = useState(false)
  const [timerOption, setTimerOption] = useState(() => {
    const saved = localStorage.getItem('captureTimerOption')
    return saved ? JSON.parse(saved) : 'none'
  })
  const [showTimerDropdown, setShowTimerDropdown] = useState(false)
  const [countdownValue, setCountdownValue] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false)
  const bgMusicRef = useRef(null)
  const imageModalRef = useRef(null)
  const countdownIntervalRef = useRef(null)
  const [dragState, setDragState] = useState(null)
  const [draggedImageId, setDraggedImageId] = useState(null)
  const [dragImageSource, setDragImageSource] = useState(null)
  const [dragImagePos, setDragImagePos] = useState({ x: 0, y: 0 })
  const [kissCamPos, setKissCamPos] = useState({ x: 650, y: 5 })
const [downloadsPos, setDownloadsPos] = useState({ x: 50, y: 483 })
  const [musicPlayerPos, setMusicPlayerPos] = useState({ x: 1200, y: 480 })
  const [controlsWindowPos, setControlsWindowPos] = useState({ x: 310, y: 15 })
  const [piercingControlsPos, setPiercingControlsPos] = useState({ x: 310, y: 15 })
  const [trashPos, setTrashPos] = useState({ x: 250, y: 650 })
  const [purplePalacePos, setPurplePalacePos] = useState({ x: 880, y: 550 })
  const [captureNotificationPos, setCaptureNotificationPos] = useState({ x: 700, y: 200 })
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn')
    return saved ? JSON.parse(saved) : false
  })
  const [bgImagesLoaded, setBgImagesLoaded] = useState(false)
  const [bgImageLoaded, setBgImageLoaded] = useState(false)
  const [currentFilter, setCurrentFilter] = useState(() => {
    const saved = localStorage.getItem('currentFilter')
    return saved ? JSON.parse(saved) : 'normal'
  })
  const [useHeartFilter, setUseHeartFilter] = useState(() => {
    const saved = localStorage.getItem('useHeartFilter')
    return saved ? JSON.parse(saved) : false
  })
  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem('currentView')
    return saved ? JSON.parse(saved) : 'normal'
  })
  const [useBloodSplatter, setUseBloodSplatter] = useState(() => {
    const saved = localStorage.getItem('useBloodSplatter')
    return saved ? JSON.parse(saved) : false
  })
  const [useGrain, setUseGrain] = useState(() => {
    const saved = localStorage.getItem('useGrain')
    return saved ? JSON.parse(saved) : true  // Default: true (enabled)
  })
  const [currentBorder, setCurrentBorder] = useState(() => {
    const saved = localStorage.getItem('currentBorder')
    return saved ? JSON.parse(saved) : 'none'
  })
  const [showMichonneOverlay, setShowMichonneOverlay] = useState(() => {
    const saved = localStorage.getItem('showMichonneOverlay')
    return saved ? JSON.parse(saved) : true
  })
  const [useSeptum, setUseSeptum] = useState(() => {
    const saved = localStorage.getItem('useSeptum')
    return saved ? JSON.parse(saved) : false
  })
  const [useEyebrow, setUseEyebrow] = useState(() => {
    const saved = localStorage.getItem('useEyebrow')
    return saved ? JSON.parse(saved) : false
  })
  const [useLip, setUseLip] = useState(() => {
    const saved = localStorage.getItem('useLip')
    return saved ? JSON.parse(saved) : false
  })
  const [useLabret, setUseLabret] = useState(() => {
    const saved = localStorage.getItem('useLabret')
    return saved ? JSON.parse(saved) : false
  })
  const [useNoseStud, setUseNoseStud] = useState(() => {
    const saved = localStorage.getItem('useNoseStud')
    return saved ? JSON.parse(saved) : false
  })
  const [useSpike, setUseSpike] = useState(() => {
    const saved = localStorage.getItem('useSpike')
    return saved ? JSON.parse(saved) : false
  })
  const [useBridge, setUseBridge] = useState(() => {
    const saved = localStorage.getItem('useBridge')
    return saved ? JSON.parse(saved) : false
  })
  const [useEyeGem, setUseEyeGem] = useState(() => {
    const saved = localStorage.getItem('useEyeGem')
    return saved ? JSON.parse(saved) : false
  })
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showStorageLimitModal, setShowStorageLimitModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isSavingZip, setIsSavingZip] = useState(false)
  const [showSaveAllModal, setShowSaveAllModal] = useState(false)

  // Fade in animation
  const fadeProps = useSpring({ opacity: 1, from: { opacity: 0 } })

  // Save Michonne position to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('michonneOffsetX', offsetX.toString())
  }, [offsetX])

  useEffect(() => {
    localStorage.setItem('michonneOffsetY', offsetY.toString())
  }, [offsetY])

  useEffect(() => {
    localStorage.setItem('michonneScale', scale.toString())
  }, [scale])

  useEffect(() => {
    localStorage.setItem('michonneRotation', rotation.toString())
  }, [rotation])

  // Update bgImagesLoaded when background image is loaded
  useEffect(() => {
    if (bgImageLoaded) {
      setBgImagesLoaded(true)
    }
  }, [bgImageLoaded])

  // Load captured images from localStorage on mount
  useEffect(() => {
    const savedImages = localStorage.getItem('capturedImages')
    if (savedImages) {
      try {
        const images = JSON.parse(savedImages)
        setCapturedImages(images)
        setImageCount(images.length)
        imageCountRef.current = images.length
      } catch (error) {
        console.error('Error loading saved images:', error)
      }
    }
    // Load capture counter from localStorage
    const savedCaptureCounter = localStorage.getItem('captureCounter')
    if (savedCaptureCounter) {
      try {
        captureCounterRef.current = parseInt(savedCaptureCounter, 10)
      } catch (error) {
        console.error('Error loading capture counter:', error)
        captureCounterRef.current = 0
      }
    }
    // Load trashed images from localStorage
    const savedTrashedImages = localStorage.getItem('trashedImages')
    if (savedTrashedImages) {
      try {
        const trashedImgs = JSON.parse(savedTrashedImages)
        setTrashedImages(trashedImgs)
      } catch (error) {
        console.error('Error loading trashed images:', error)
      }
    }
    // Load window positions from localStorage (persists across sessions)
    const savedWindowPositions = localStorage.getItem('windowPositions')
    if (savedWindowPositions) {
      try {
        const positions = JSON.parse(savedWindowPositions)
        if (positions.kissCamPos) setKissCamPos(positions.kissCamPos)
        if (positions.downloadsPos) setDownloadsPos(positions.downloadsPos)
        if (positions.musicPlayerPos) setMusicPlayerPos(positions.musicPlayerPos)
        if (positions.controlsWindowPos) setControlsWindowPos(positions.controlsWindowPos)
        if (positions.piercingControlsPos) setPiercingControlsPos(positions.piercingControlsPos)
        if (positions.trashPos) setTrashPos(positions.trashPos)
        if (positions.purplePalacePos) setPurplePalacePos(positions.purplePalacePos)
        if (positions.captureNotificationPos) setCaptureNotificationPos(positions.captureNotificationPos)
      } catch (error) {
        console.error('Error loading window positions:', error)
      }
    }
  }, [])

  // Persist login state to localStorage
  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn))
  }, [isLoggedIn])

  // Persist current filter to localStorage
  useEffect(() => {
    localStorage.setItem('currentFilter', JSON.stringify(currentFilter))
  }, [currentFilter])

  // Persist timer option to localStorage
  useEffect(() => {
    localStorage.setItem('captureTimerOption', JSON.stringify(timerOption))
  }, [timerOption])

  // Persist window positions to localStorage (persists across sessions)
  // Persist view option to localStorage
  useEffect(() => {
    localStorage.setItem('currentView', JSON.stringify(currentView))
  }, [currentView])

  // Persist heart filter toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useHeartFilter', JSON.stringify(useHeartFilter))
  }, [useHeartFilter])

  // Persist blood splatter toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useBloodSplatter', JSON.stringify(useBloodSplatter))
  }, [useBloodSplatter])

  // Persist grain toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useGrain', JSON.stringify(useGrain))
  }, [useGrain])

  // Persist current border to localStorage
  useEffect(() => {
    localStorage.setItem('currentBorder', JSON.stringify(currentBorder))
  }, [currentBorder])

  // Persist michonne overlay toggle to localStorage
  useEffect(() => {
    localStorage.setItem('showMichonneOverlay', JSON.stringify(showMichonneOverlay))
  }, [showMichonneOverlay])

  // Persist septum piercing toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useSeptum', JSON.stringify(useSeptum))
  }, [useSeptum])

  // Persist eyebrow piercing toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useEyebrow', JSON.stringify(useEyebrow))
  }, [useEyebrow])

  // Persist lip piercing toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useLip', JSON.stringify(useLip))
  }, [useLip])

  // Persist labret piercing toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useLabret', JSON.stringify(useLabret))
  }, [useLabret])

  // Persist nose stud piercing toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useNoseStud', JSON.stringify(useNoseStud))
  }, [useNoseStud])

  // Persist spike piercing toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useSpike', JSON.stringify(useSpike))
  }, [useSpike])

  // Persist bridge piercing toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useBridge', JSON.stringify(useBridge))
  }, [useBridge])

  // Persist eyes piercing toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useEyeGem', JSON.stringify(useEyeGem))
  }, [useEyeGem])

  // Keep imageCountRef in sync with imageCount state
  useEffect(() => {
    imageCountRef.current = imageCount
  }, [imageCount])

  // Keep piercingAdjustmentsRef in sync with piercingAdjustments state
  useEffect(() => {
    piercingAdjustmentsRef.current = piercingAdjustments
  }, [piercingAdjustments])

  // Ensure Controls stays closed when logged in
  useEffect(() => {
    if (isLoggedIn) {
      setShowControls(false)
    }
  }, [isLoggedIn])

  // Close controls when Michonne overlay is disabled
  useEffect(() => {
    if (!showMichonneOverlay && showControls) {
      setShowControls(false)
    }
  }, [showMichonneOverlay])

  // Cheek and jawline landmark indices from MediaPipe Face Landmarker
  // Left cheek: index 234, Right cheek: index 454
  // Left jawline: index 206
  const LEFT_CHEEK_INDEX = 234
  const RIGHT_CHEEK_INDEX = 454
  const LEFT_JAWLINE_INDEX = 206

  // Initialize MediaPipe Face Landmarker
  useEffect(() => {
    const initializeFaceLandmarker = async () => {
      try {
        const visionModule = await import(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8'
        )

        const { FilesetResolver, FaceLandmarker } = visionModule

        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm'
        )

        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          },
          runningMode: 'VIDEO',
          numFaces: 10,
        })

        faceLandmarkerRef.current = faceLandmarker
        console.log('Face Landmarker initialized')

      } catch (err) {
        console.error(err)
      }
    }

    initializeFaceLandmarker()

    // Add keyboard shortcuts
    const handleKeyPress = (e) => {
      if (e.key === 'c' || e.key === 'C') {
        playClickSound()
        setShowControls((prev) => !prev)
      }
      // Spacebar to pause/play music
      if (e.code === 'Space') {
        e.preventDefault()
        playClickSound()
        // Check directly from the audio element instead of state
        if (bgMusicRef.current && !bgMusicRef.current.paused) {
          bgMusicRef.current.pause()
          setIsMusicPlaying(false)
        } else if (bgMusicRef.current) {
          bgMusicRef.current.play()
          setIsMusicPlaying(true)
        }
      }
      // Right arrow to skip to next song
      if (e.code === 'ArrowRight') {
        e.preventDefault()
        handleNextSong()
      }
      // Left arrow to go to previous song
      if (e.code === 'ArrowLeft') {
        e.preventDefault()
        handlePreviousSong()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close()
      }
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  // Listen to audio play/pause events to update UI
  useEffect(() => {
    console.log('Audio useEffect running')
    
    const attachListeners = () => {
      const audioElement = bgMusicRef.current
      console.log('Checking audioElement:', audioElement)
      
      if (!audioElement) {
        console.log('Audio element not found, retrying...')
        // Retry after a longer delay
        setTimeout(attachListeners, 500)
        return
      }

      console.log('Audio element found! Attaching listeners')
      const handlePlay = () => setIsMusicPlaying(true)
      const handlePause = () => setIsMusicPlaying(false)
      const handleTimeUpdate = () => {
        console.log('timeupdate:', audioElement.currentTime)
        setAudioCurrentTime(audioElement.currentTime)
      }
      const handleLoadedMetadata = () => {
        console.log('loadedmetadata fired')
        setAudioDuration(audioElement.duration || 0)
        setAudioCurrentTime(audioElement.currentTime)
      }

      audioElement.addEventListener('play', handlePlay)
      audioElement.addEventListener('pause', handlePause)
      audioElement.addEventListener('timeupdate', handleTimeUpdate)
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata)

      // Store refs for cleanup
      audioElement._handlePlay = handlePlay
      audioElement._handlePause = handlePause
      audioElement._handleTimeUpdate = handleTimeUpdate
      audioElement._handleLoadedMetadata = handleLoadedMetadata
    }

    const timer = setTimeout(attachListeners, 0)
    
    return () => {
      clearTimeout(timer)
      const audioElement = bgMusicRef.current
      if (audioElement && audioElement._handlePlay) {
        audioElement.removeEventListener('play', audioElement._handlePlay)
        audioElement.removeEventListener('pause', audioElement._handlePause)
        audioElement.removeEventListener('timeupdate', audioElement._handleTimeUpdate)
        audioElement.removeEventListener('loadedmetadata', audioElement._handleLoadedMetadata)
      }
    }
  }, [currentSongIndex])

  // Preload critical overlay image immediately
  useEffect(() => {
    const kissImg_ = new Image()
    kissImg_.src = kissImg
    kissImg_.onload = () => {
      overlayImageRef.current = kissImg_
      console.log('Michonne kiss image preloaded')
    }
    kissImg_.onerror = () => {
      console.error('Failed to preload Michonne overlay image')
      setCameraError('Failed to load Michonne overlay image')
    }
  }, [])

  // Load overlay images and preload assets
  useEffect(() => {
    // Always load heart filter
    const heartImg = new Image()
    heartImg.src = heartFilterImg
    heartImg.onload = () => {
      heartFilterRef.current = heartImg
    }
    heartImg.onerror = () => {
      console.error('Failed to load heart filter image')
    }

    // Preload logos
    const preloadImage = (src) => {
      const img = new Image()
      img.src = src
    }
    preloadImage(letterboxdLogo)
    preloadImage(purblePalaceLogo)

    // Load blood splatter
    const splatterImg = new Image()
    splatterImg.src = new URL('./assets/Blood_Splatter.png', import.meta.url).href
    splatterImg.onload = () => {
      bloodSplatterRef.current = splatterImg
    }
    splatterImg.onerror = () => {
      console.error('Failed to load blood splatter image')
    }

    // Load piercing images
    const septumImage = new Image()
    septumImage.src = septumImg
    septumImage.onload = () => {
      septumRef.current = septumImage
    }
    septumImage.onerror = () => {
      console.error('Failed to load septum piercing image')
    }

    const eyebrowImage = new Image()
    eyebrowImage.src = eyebrowImg
    eyebrowImage.onload = () => {
      eyebrowRef.current = eyebrowImage
    }
    eyebrowImage.onerror = () => {
      console.error('Failed to load eyebrow piercing image')
    }

    const lipImage = new Image()
    lipImage.src = lipImg
    lipImage.onload = () => {
      lipRef.current = lipImage
    }
    lipImage.onerror = () => {
      console.error('Failed to load lip piercing image')
    }

    const labretImage = new Image()
    labretImage.src = labretImg
    labretImage.onload = () => {
      labretRef.current = labretImage
    }
    labretImage.onerror = () => {
      console.error('Failed to load labret piercing image')
    }

    const noseStudImage = new Image()
    noseStudImage.src = noseStudImg
    noseStudImage.onload = () => {
      noseStudRef.current = noseStudImage
    }
    noseStudImage.onerror = () => {
      console.error('Failed to load nose stud image')
    }

    const spikeImage = new Image()
    spikeImage.src = spikeImg
    spikeImage.onload = () => {
      spikeRef.current = spikeImage
    }
    spikeImage.onerror = () => {
      console.error('Failed to load spike piercing image')
    }

    const bridgeImage = new Image()
    bridgeImage.src = bridgeImg
    bridgeImage.onload = () => {
      bridgeRef.current = bridgeImage
    }
    bridgeImage.onerror = () => {
      console.error('Failed to load bridge piercing image')
    }

    const eyeGemImage = new Image()
    eyeGemImage.src = studImg
    eyeGemImage.onload = () => {
      eyeGemRef.current = eyeGemImage
    }
    eyeGemImage.onerror = () => {
      console.error('Failed to load eye gem image')
    }

    // Preload all borders
    const borderMap = {
      film_frame: new URL('./assets/film_frame.png', import.meta.url).href,
      filter_border: new URL('./assets/filter_border.png', import.meta.url).href,
      katana_border: new URL('./assets/katana_border.png', import.meta.url).href,
      mothers_armpits: new URL('./assets/armpit.png', import.meta.url).href
    }
    Object.values(borderMap).forEach((borderSrc) => {
      const borderImg = new Image()
      borderImg.src = borderSrc
    })

    // Load border if selected
    if (currentBorder !== 'none') {
      // Clear old border reference to prevent glitch during transition
      borderRef.current = null
      
      const borderImg = new Image()
      borderImg.src = borderMap[currentBorder]
      borderImg.onload = () => {
        borderRef.current = borderImg
      }
      borderImg.onerror = () => {
        console.error(`Failed to load border image: ${currentBorder}`)
      }
    } else {
      // Clear border reference when 'none' is selected
      borderRef.current = null
    }
  }, [currentBorder])

  // Start webcam
  const startWebcam = async () => {
    try {
      setCameraError(null)
      console.log('Requesting camera access...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      console.log('Camera stream obtained:', stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        console.log('Stream assigned to video element')
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Video play error:', error)
            setCameraError(`Video play error: ${error.message}`)
          })
        }
        setIsWebcamActive(true)
        console.log('Webcam activated')
      }
    } catch (error) {
      console.error('Error accessing webcam:', error)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      let errorMsg = 'Could not access webcam. Please check permissions.'
      if (error.name === 'NotAllowedError') {
        errorMsg = 'Camera permission denied. Please allow camera access in your browser settings.'
      } else if (error.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device.'
      } else if (error.name === 'NotReadableError') {
        errorMsg = 'Camera is already in use by another application.'
      }
      setCameraError(errorMsg)
      setIsWebcamActive(false)
    }
  }

  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null  // Release the stream completely
      setIsWebcamActive(false)
    }
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
    }
    // Clear canvas to black
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  // Convert normalized landmark coordinates to canvas pixel coordinates
  const normalizedToCanvasCoordinates = (
    normalizedX,
    normalizedY,
    canvasWidth,
    canvasHeight
  ) => {
    // Mirror X coordinate for webcam (since it's mirrored)
    const pixelX = (1 - normalizedX) * canvasWidth
    const pixelY = normalizedY * canvasHeight
    return { pixelX, pixelY }
  }

  // Add realistic film grain texture to canvas with performance optimization
  const addGrainTexture = (canvas, ctx, intensity = 0.12, frameOffset = 0) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const length = data.length
    
    // Pseudo-random function based on position and frame for animated grain
    const seededRandom = (x, y, frame) => {
      const n = Math.sin(x * 12.9898 + y * 78.233 + frame * 43758.5453) * 43758.5453
      return n - Math.floor(n)
    }
    
    // Process pixels with reduced grain for softer, more realistic appearance
    for (let i = 0; i < length; i += 4) {
      // Calculate position for seeded randomness
      const pixelIndex = i / 4
      const y = Math.floor(pixelIndex / canvas.width)
      const x = pixelIndex % canvas.width
      
      // Generate monochrome grain with softer distribution
      // Combine seeded random with frame offset for animation
      const random1 = seededRandom(x, y, frameOffset)
      const random2 = seededRandom(x + 1, y + 1, frameOffset)
      
      // Create softer, more natural-looking grain with slight bias toward center
      const noise = (random1 + random2 - 1) * 0.5  // Average for smoother grain
      const grain = noise * 255 * intensity
      
      // Apply monochrome grain with clamping to prevent blown-out highlights/crushed blacks
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      data[i] = Math.max(0, Math.min(255, r + grain))       // Red
      data[i + 1] = Math.max(0, Math.min(255, g + grain))   // Green
      data[i + 2] = Math.max(0, Math.min(255, b + grain))   // Blue
      // data[i + 3] remains unchanged (alpha)
    }
    
    ctx.putImageData(imageData, 0, 0)
  }

  // Draw frame with face detection and overlay
  const drawFrame = () => {
    if (!videoRef.current || !canvasRef.current || !faceLandmarkerRef.current) {
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const video = videoRef.current

    // Set canvas size to match video
    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth
    }
    if (canvas.height !== video.videoHeight) {
      canvas.height = video.videoHeight
    }

    // Always draw single frame first (video + overlays)
    // Normal single frame (mirrored for webcam effect)
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
    ctx.restore()

    // Run face detection on the full video
    let topHeadLandmark = null
    let allFaceLandmarks = null
    let allDetectedFaces = []
    try {
      const results = faceLandmarkerRef.current.detectForVideo(video, Date.now())

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        allDetectedFaces = results.faceLandmarks
        const landmarks = results.faceLandmarks[0]
        allFaceLandmarks = landmarks

        // Get left jawline position for michonne
        const cheekLandmark = landmarks[LEFT_JAWLINE_INDEX]
        // Get top of head position (using landmark 10 which is typically top of head)
        topHeadLandmark = landmarks[10]

        if (cheekLandmark) {
          const { pixelX, pixelY } = normalizedToCanvasCoordinates(
            cheekLandmark.x,
            cheekLandmark.y,
            canvas.width,
            canvas.height
          )

          // Draw michonne_kiss.png at cheek position if enabled
          if (showMichonneOverlay && overlayImageRef.current) {
            const img = overlayImageRef.current
            
            // Calculate dynamic scale based on face size (proximity to camera)
            // Use distance between eyes as a proxy for face size
            const leftEye = landmarks[33]  // Left eye landmark
            const rightEye = landmarks[263] // Right eye landmark
            
            let dynamicScale = scale
            if (leftEye && rightEye) {
              // Calculate eye distance in normalized coordinates
              const eyeDistance = Math.sqrt(
                Math.pow(rightEye.x - leftEye.x, 2) + 
                Math.pow(rightEye.y - leftEye.y, 2)
              )
              
              // Reference eye distance at default zoom (around 0.15 in normalized coords)
              const referenceEyeDistance = 0.15
              
              // Scale michonne proportionally to how close the user is
              // If eyes are closer together (zoomed in), face is further, scale down
              // If eyes are further apart (zoomed out), face is closer, scale up
              const proximityRatio = eyeDistance / referenceEyeDistance
              dynamicScale = scale * proximityRatio
              
              // Clamp scale between 0.3 and 1.5 to prevent extreme values
              dynamicScale = Math.max(0.3, Math.min(1.5, dynamicScale))
            }
            
            const scaledWidth = img.width * dynamicScale
            const scaledHeight = img.height * dynamicScale

            const drawX = pixelX + 40 + offsetX
            const drawY = pixelY + 60 - scaledHeight / 2 + offsetY

            ctx.globalAlpha = 1
            ctx.save()
            ctx.translate(drawX + scaledWidth / 2, drawY + scaledHeight / 2)
            ctx.rotate((rotation * Math.PI) / 180)
            ctx.scale(-1, 1)
            ctx.drawImage(
              img,
              -scaledWidth / 2,
              -scaledHeight / 2,
              scaledWidth,
              scaledHeight
            )
            ctx.restore()
            ctx.globalAlpha = 1.0
          }
        }
      }
    } catch (error) {
      console.error('Face detection error:', error)
    }

    // Apply black & white filter to entire scene
    if (currentFilter === 'blackAndWhite') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        data[i] = avg     // Red
        data[i + 1] = avg // Green
        data[i + 2] = avg // Blue
      }
      ctx.putImageData(imageData, 0, 0)
    }

    // Apply tint filter (2016 Instagram-style: warm, desaturated, vintage)
    if (currentFilter === 'tint') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const gray = (r + g + b) / 3
        
        // 2016 filter: warm, slightly desaturated, vintage faded look
        data[i] = Math.max(0, Math.min(255, r * 0.75 + gray * 0.25 + 15))     // Red: subtle boost
        data[i + 1] = Math.max(0, Math.min(255, g * 0.8 + gray * 0.2 + 8))    // Green: minimal boost
        data[i + 2] = Math.max(0, Math.min(255, b * 0.65 + gray * 0.35 - 15)) // Blue: reduced
      }
      ctx.putImageData(imageData, 0, 0)
    }

    // Add realistic film grain texture to all frames with frame-based animation
    if (useGrain) {
      frameCounterRef.current++
      addGrainTexture(canvas, ctx, 0.12, frameCounterRef.current)
    }

    // Draw heart filter AFTER black & white and grain so it stays colored and on top
    // Apply to all detected faces
    if (useHeartFilter && heartFilterRef.current && allDetectedFaces.length > 0) {
      try {
        console.log(`Drawing hearts on ${allDetectedFaces.length} faces`)
        allDetectedFaces.forEach((faceLandmarks, faceIndex) => {
          const topHead = faceLandmarks[10] // Top of head
          const leftEye = faceLandmarks[33]  // Left eye landmark
          const rightEye = faceLandmarks[263] // Right eye landmark
          
          if (!topHead) {
            console.log(`Face ${faceIndex}: Missing topHead landmark`)
            return
          }
          
          const { pixelX: headX, pixelY: headY } = normalizedToCanvasCoordinates(
            topHead.x,
            topHead.y,
            canvas.width,
            canvas.height
          )

          // Calculate dynamic scale based on face size (proximity to camera)
          let dynamicScale = 0.2
          if (leftEye && rightEye) {
            const eyeDistance = Math.sqrt(
              Math.pow(rightEye.x - leftEye.x, 2) + 
              Math.pow(rightEye.y - leftEye.y, 2)
            )
            const referenceEyeDistance = 0.15
            const proximityRatio = eyeDistance / referenceEyeDistance
            dynamicScale = 0.2 * proximityRatio
            dynamicScale = Math.max(0.1, Math.min(0.4, dynamicScale))
          }

          const heartImg = heartFilterRef.current
          const heartWidth = heartImg.width * dynamicScale
          const heartHeight = heartImg.height * dynamicScale

          // Position above head
          const heartX = headX - heartWidth / 2
          const heartY = headY - heartHeight - 20

          console.log(`Drawing heart ${faceIndex} at (${headX}, ${headY})`)
          ctx.save()
          ctx.globalAlpha = 1
          ctx.drawImage(
            heartImg,
            heartX,
            heartY,
            heartWidth,
            heartHeight
          )
          ctx.restore()
        })
      } catch (error) {
        console.error('Heart filter rendering error:', error)
      }
    }

    // Draw border overlay if one is selected (skip in 4-grid/double modes, but always draw mothers_armpits)
    if (currentBorder !== 'none' && borderRef.current) {
      const isGridOrDoubleMode = currentView === 'fourGrid' || currentView === 'double'
      const isMothersArmpits = currentBorder === 'mothers_armpits'
      
      // Only draw normal borders in normal view mode
      if (!isGridOrDoubleMode && !isMothersArmpits) {
        const borderImg = borderRef.current
        let borderScale = 1 // Default
        let borderOpacity = 1 // Default opacity
        
        if (currentBorder === 'film_frame') {
          borderScale = 1.0
          borderOpacity = 0.8
        }
        if (currentBorder === 'filter_border') {
          borderScale = 1.2
          borderOpacity = 1
        }
        if (currentBorder === 'katana_border') {
          borderScale = 1.0
        }
        
        const borderWidth = canvas.width * borderScale
        const borderHeight = canvas.height * borderScale
        const borderX = (canvas.width - borderWidth) / 2
        const borderY = (canvas.height - borderHeight) / 2

        ctx.globalAlpha = borderOpacity
        ctx.drawImage(borderImg, borderX, borderY, borderWidth, borderHeight)
        ctx.globalAlpha = 1.0
      }
    }

    // Draw Mother's Armpits filter if selected (bottom edge touches top of head, positioned at right edge)
    if (currentBorder === 'mothers_armpits' && borderRef.current && allDetectedFaces.length > 0) {
      try {
        allDetectedFaces.forEach((faceLandmarks, faceIndex) => {
          const leftEye = faceLandmarks[33]  // Left eye landmark
          const rightEye = faceLandmarks[263] // Right eye landmark
          const topHead = faceLandmarks[10] // Top of head landmark
          
          if (!topHead || !leftEye || !rightEye) {
            return
          }
          
          // Convert top head position to canvas coordinates
          const { pixelX: headX, pixelY: headY } = normalizedToCanvasCoordinates(
            topHead.x,
            topHead.y,
            canvas.width,
            canvas.height
          )
          
          // Convert right eye to canvas coordinates for right edge positioning
          const { pixelX: rightEyeX } = normalizedToCanvasCoordinates(
            rightEye.x,
            rightEye.y,
            canvas.width,
            canvas.height
          )
          
          // Calculate dynamic scale based on face size
          const eyeDistance = Math.sqrt(
            Math.pow(rightEye.x - leftEye.x, 2) + 
            Math.pow(rightEye.y - leftEye.y, 2)
          )
          const referenceEyeDistance = 0.15
          const proximityRatio = eyeDistance / referenceEyeDistance
          const dynamicScale = 0.7 * proximityRatio
          const finalScale = Math.max(0.2, Math.min(3, dynamicScale))
          
          const armpitImg = borderRef.current
          const armpitWidth = armpitImg.width * finalScale
          const armpitHeight = armpitImg.height * finalScale
          
          // Create temporary offscreen canvas for armpit with potential filter application
          let imageToDrawArmpitFrom = armpitImg
          
          if (currentFilter === 'blackAndWhite' || currentFilter === 'tint') {
            // Create temp canvas to apply filter to armpit
            const armpitTempCanvas = document.createElement('canvas')
            armpitTempCanvas.width = armpitImg.width
            armpitTempCanvas.height = armpitImg.height
            const armpitTempCtx = armpitTempCanvas.getContext('2d')
            armpitTempCtx.drawImage(armpitImg, 0, 0)
            
            // Apply the selected filter
            if (currentFilter === 'blackAndWhite') {
              const imageData = armpitTempCtx.getImageData(0, 0, armpitTempCanvas.width, armpitTempCanvas.height)
              const data = imageData.data
              for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
                data[i] = avg     // Red
                data[i + 1] = avg // Green
                data[i + 2] = avg // Blue
              }
              armpitTempCtx.putImageData(imageData, 0, 0)
            } else if (currentFilter === 'tint') {
              const imageData = armpitTempCtx.getImageData(0, 0, armpitTempCanvas.width, armpitTempCanvas.height)
              const data = imageData.data
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i]
                const g = data[i + 1]
                const b = data[i + 2]
                const gray = (r + g + b) / 3
                
                // 2016 filter: warm, slightly desaturated, vintage faded look
                data[i] = Math.max(0, Math.min(255, r * 0.75 + gray * 0.25 + 15))     // Red: subtle boost
                data[i + 1] = Math.max(0, Math.min(255, g * 0.8 + gray * 0.2 + 8))    // Green: minimal boost
                data[i + 2] = Math.max(0, Math.min(255, b * 0.65 + gray * 0.35 - 15)) // Blue: reduced
              }
              armpitTempCtx.putImageData(imageData, 0, 0)
            }
            
            imageToDrawArmpitFrom = armpitTempCanvas
          }
          
          ctx.save()
          ctx.globalAlpha = 1
          // Position at right edge of head with rotation preserved, bottom edge touching top of head
          ctx.translate(rightEyeX, headY)
          ctx.rotate((20 * Math.PI) / 180) // Keep original rotation
          ctx.drawImage(
            imageToDrawArmpitFrom,
            -armpitWidth / 2,
            -armpitHeight,
            armpitWidth,
            armpitHeight
          )
          ctx.restore()
        })
      } catch (error) {
        console.error('Mothers Armpits filter rendering error:', error)
      }
    }

    // Render piercings
    const drawPiercing = (piercingImg, piercingRef, faceLandmarks, landmarkIndices, piercing) => {
      if (!piercingImg) return
      
      const primaryLandmark = faceLandmarks[landmarkIndices[0]]
      if (!primaryLandmark) return
      
      let { pixelX, pixelY } = normalizedToCanvasCoordinates(
        primaryLandmark.x,
        primaryLandmark.y,
        canvas.width,
        canvas.height
      )
      
      // Apply offset adjustments for specific piercings
      if (piercing === 'eyebrow') {
        pixelY -= 6 // Move eyebrow piercing up
      }
      if (piercing === 'noseStud') {
        pixelX += 8 // Move nose stud to the right
        pixelY += 18 // Move nose stud down under the nose
      }
      if (piercing === 'spikeLeft') {
        pixelY -= 8 // Move spikes up
        pixelX -= 10 // Move left spike further left
      }
      if (piercing === 'spikeRight') {
        pixelY -= 8 // Move spikes up
        pixelX += 10 // Move right spike further right
      }
      if (piercing === 'bridgeLeft') {
        pixelY -= 100 // Move bridge piercings higher up
        pixelX -= 9 // Move left bridge piercing left (shorter distance)
      }
      if (piercing === 'bridgeRight') {
        pixelY -= 100 // Move bridge piercings higher up
        pixelX += 20 // Move right bridge piercing right (shorter distance)
      }
      // Eye gem positioning handled by control sliders
      
      // Apply stored adjustments from piercingControls
      const piercingAdjustX = piercingAdjustmentsRef.current[`piercing_${piercing}_offsetX`] ?? 0
      const piercingAdjustY = piercingAdjustmentsRef.current[`piercing_${piercing}_offsetY`] ?? 0
      pixelX += piercingAdjustX
      pixelY += piercingAdjustY
      
      // Calculate scale based on face size using eye distance
      const leftEye = faceLandmarks[33]
      const rightEye = faceLandmarks[263]
      if (!leftEye || !rightEye) return
      
      const eyeDistance = Math.sqrt(
        Math.pow(rightEye.x - leftEye.x, 2) + 
        Math.pow(rightEye.y - leftEye.y, 2)
      )
      const referenceEyeDistance = 0.15
      const proximityRatio = eyeDistance / referenceEyeDistance
      
      // Scale multiplier per piercing type
      let scaleMultiplier = 1.0
      if (piercing === 'septum') scaleMultiplier = 1.5
      if (piercing === 'eyebrow') scaleMultiplier = 2.5
      if (piercing === 'lip') scaleMultiplier = 2
      if (piercing === 'labret') scaleMultiplier = 2.5
      if (piercing === 'noseStud') scaleMultiplier = 0.4
      if (piercing === 'spikeLeft') scaleMultiplier = 0.5
      if (piercing === 'spikeRight') scaleMultiplier = 0.5
      if (piercing === 'bridgeLeft') scaleMultiplier = 0.45
      if (piercing === 'bridgeRight') scaleMultiplier = 0.45
      if (piercing === 'eyeGem') scaleMultiplier = 0.24
      
      const dynamicScale = 0.05 * proximityRatio * scaleMultiplier
      const scaleMultiplierAdjustment = piercingAdjustmentsRef.current[`piercing_${piercing}_scale`] ?? 1
      const finalScale = Math.max(0.003, Math.min(0.25, dynamicScale * scaleMultiplierAdjustment))
      
      const piercingWidth = piercingImg.width * finalScale
      const piercingHeight = piercingImg.height * finalScale
      
      // Apply filters to piercing if needed
      let imageToDrawFrom = piercingImg
      
      if (currentFilter === 'blackAndWhite' || currentFilter === 'tint') {
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = piercingImg.width
        tempCanvas.height = piercingImg.height
        const tempCtx = tempCanvas.getContext('2d')
        tempCtx.drawImage(piercingImg, 0, 0)
        
        if (currentFilter === 'blackAndWhite') {
          const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
          const data = imageData.data
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
            data[i] = avg
            data[i + 1] = avg
            data[i + 2] = avg
          }
          tempCtx.putImageData(imageData, 0, 0)
        } else if (currentFilter === 'tint') {
          const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
          const data = imageData.data
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            const gray = (r + g + b) / 3
            
            data[i] = Math.max(0, Math.min(255, r * 0.75 + gray * 0.25 + 15))
            data[i + 1] = Math.max(0, Math.min(255, g * 0.8 + gray * 0.2 + 8))
            data[i + 2] = Math.max(0, Math.min(255, b * 0.65 + gray * 0.35 - 15))
          }
          tempCtx.putImageData(imageData, 0, 0)
        }
        
        imageToDrawFrom = tempCanvas
      }
      
      // Darken spike piercings
      if (piercing === 'spikeLeft' || piercing === 'spikeRight') {
        const darkenCanvas = document.createElement('canvas')
        darkenCanvas.width = imageToDrawFrom.width
        darkenCanvas.height = imageToDrawFrom.height
        const darkenCtx = darkenCanvas.getContext('2d')
        darkenCtx.drawImage(imageToDrawFrom, 0, 0)
        
        const imageData = darkenCtx.getImageData(0, 0, darkenCanvas.width, darkenCanvas.height)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.max(0, data[i] * 0.8)     // Darken red
          data[i + 1] = Math.max(0, data[i + 1] * 0.8) // Darken green
          data[i + 2] = Math.max(0, data[i + 2] * 0.8) // Darken blue
        }
        darkenCtx.putImageData(imageData, 0, 0)
        imageToDrawFrom = darkenCanvas
      }
      
      // Darken bridge piercings
      if (piercing === 'bridgeLeft' || piercing === 'bridgeRight') {
        const darkenCanvas = document.createElement('canvas')
        darkenCanvas.width = imageToDrawFrom.width
        darkenCanvas.height = imageToDrawFrom.height
        const darkenCtx = darkenCanvas.getContext('2d')
        darkenCtx.drawImage(imageToDrawFrom, 0, 0)
        
        const imageData = darkenCtx.getImageData(0, 0, darkenCanvas.width, darkenCanvas.height)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.max(0, data[i] * 0.9)     // Darken red
          data[i + 1] = Math.max(0, data[i + 1] * 0.9) // Darken green
          data[i + 2] = Math.max(0, data[i + 2] * 0.9) // Darken blue
        }
        darkenCtx.putImageData(imageData, 0, 0)
        imageToDrawFrom = darkenCanvas
      }
      
      // Brighten eyebrow piercing
      if (piercing === 'eyebrow') {
        const brightenCanvas = document.createElement('canvas')
        brightenCanvas.width = imageToDrawFrom.width
        brightenCanvas.height = imageToDrawFrom.height
        const brightenCtx = brightenCanvas.getContext('2d')
        brightenCtx.drawImage(imageToDrawFrom, 0, 0)
        
        const imageData = brightenCtx.getImageData(0, 0, brightenCanvas.width, brightenCanvas.height)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.3)     // Brighten red
          data[i + 1] = Math.min(255, data[i + 1] * 1.3) // Brighten green
          data[i + 2] = Math.min(255, data[i + 2] * 1.3) // Brighten blue
        }
        brightenCtx.putImageData(imageData, 0, 0)
        imageToDrawFrom = brightenCanvas
      }
      
      ctx.save()
      ctx.globalAlpha = 1
      ctx.translate(pixelX, pixelY)
      
      // Apply rotation if specified
      const rotation = (piercingAdjustmentsRef.current[`piercing_${piercing}_rotate`] ?? 0) * Math.PI / 180
      if (rotation !== 0) {
        ctx.rotate(rotation)
      }
      
      // Flip left spike and right bridge horizontally
      if (piercing === 'spikeLeft' || piercing === 'bridgeRight') {
        ctx.scale(-1, 1)
      }
      
      ctx.drawImage(
        imageToDrawFrom,
        -piercingWidth / 2,
        -piercingHeight / 2,
        piercingWidth,
        piercingHeight
      )
      ctx.restore()
    }

    // Reset canvas state before drawing piercings
    ctx.globalAlpha = 1.0

    if (allDetectedFaces.length > 0) {
      try {
        allDetectedFaces.forEach((faceLandmarks) => {
          // Reset globalAlpha before drawing each piercing
          ctx.globalAlpha = 1.0
          
          // Septum piercing under nose (landmark 2 = nose tip center)
          if (useSeptum && septumRef.current) {
            drawPiercing(septumRef.current, septumRef, faceLandmarks, [2], 'septum')
          }
          
          ctx.globalAlpha = 1.0
          
          // Eyebrow piercing on right eyebrow (landmark 282 = right eyebrow inner)
          if (useEyebrow && eyebrowRef.current) {
            drawPiercing(eyebrowRef.current, eyebrowRef, faceLandmarks, [282], 'eyebrow')
          }
          
          ctx.globalAlpha = 1.0
          
          // Lip piercing on bottom lip (landmark 17 = lower lip outer edge)
          if (useLip && lipRef.current) {
            drawPiercing(lipRef.current, lipRef, faceLandmarks, [16], 'lip')
          }
          
          ctx.globalAlpha = 1.0
          
          // Labret piercing under lip (landmark 18 = under lower lip)
          if (useLabret && labretRef.current) {
            drawPiercing(labretRef.current, labretRef, faceLandmarks, [18], 'labret')
          }
          
          ctx.globalAlpha = 1.0
          
          // Nose Stud piercing on right nostril (landmark 429 = right nostril)
          if (useNoseStud && noseStudRef.current) {
            drawPiercing(noseStudRef.current, noseStudRef, faceLandmarks, [429], 'noseStud')
          }
          
          ctx.globalAlpha = 1.0
          
          // Spike piercings on top of mouth (left and right)
          if (useSpike && spikeRef.current) {
            // Render left spike with custom positioning
            drawPiercing(spikeRef.current, spikeRef, faceLandmarks, [61], 'spikeLeft')
            ctx.globalAlpha = 1.0
            // Right spike with custom positioning and flip
            drawPiercing(spikeRef.current, spikeRef, faceLandmarks, [291], 'spikeRight')
          }
          
          ctx.globalAlpha = 1.0
          
          // Bridge piercings on nose bridge (left and right, landmark 4 = nose bridge)
          if (useBridge && bridgeRef.current) {
            // Render left bridge piercing
            drawPiercing(bridgeRef.current, bridgeRef, faceLandmarks, [4], 'bridgeLeft')
            ctx.globalAlpha = 1.0
            // Render right bridge piercing
            drawPiercing(bridgeRef.current, bridgeRef, faceLandmarks, [4], 'bridgeRight')
          }
          
          ctx.globalAlpha = 1.0
          
          // Eye gem under right eye (landmark 346)
          if (useEyeGem && eyeGemRef.current) {
            drawPiercing(eyeGemRef.current, eyeGemRef, faceLandmarks, [346], 'eyeGem')
          }
          
          ctx.globalAlpha = 1.0
        })
      } catch (error) {
        console.error('Piercing rendering error:', error)
      }
    }

    // If 4-grid mode: create a temporary canvas with the single frame, then tile it 4 times
    if (currentView === 'fourGrid') {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const tempCtx = tempCanvas.getContext('2d')
      
      // Copy current canvas to temp canvas
      tempCtx.drawImage(canvas, 0, 0)
      
      // Clear main canvas and draw the single frame 4 times in a 2x2 grid
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const quarterWidth = canvas.width / 2
      const quarterHeight = canvas.height / 2
      
      // Draw to all 4 quadrants
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height, 0, 0, quarterWidth, quarterHeight)
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height, quarterWidth, 0, quarterWidth, quarterHeight)
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height, 0, quarterHeight, quarterWidth, quarterHeight)
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height, quarterWidth, quarterHeight, quarterWidth, quarterHeight)
      
      // Draw Windows-style thick beveled frame to separate quadrants
      const frameWidth = 20
      
      // Draw vertical divider (thick beveled)
      // Light side
      ctx.fillStyle = '#dfdfdf'
      ctx.fillRect(quarterWidth - frameWidth / 2, 0, frameWidth / 2, canvas.height)
      // Dark side
      ctx.fillStyle = '#808080'
      ctx.fillRect(quarterWidth, 0, frameWidth / 2, canvas.height)
      
      // Draw horizontal divider (thick beveled)
      // Light side
      ctx.fillStyle = '#dfdfdf'
      ctx.fillRect(0, quarterHeight - frameWidth / 2, canvas.width, frameWidth / 2)
      // Dark side
      ctx.fillStyle = '#808080'
      ctx.fillRect(0, quarterHeight, canvas.width, frameWidth / 2)
      
      // Draw outer frame beveled border
      // Top-left light beveled edge
      ctx.fillStyle = '#dfdfdf'
      ctx.fillRect(0, 0, canvas.width, frameWidth / 2)
      ctx.fillRect(0, 0, frameWidth / 2, canvas.height)
      
      // Bottom-right dark beveled edge
      ctx.fillStyle = '#808080'
      ctx.fillRect(0, canvas.height - frameWidth / 2, canvas.width, frameWidth / 2)
      ctx.fillRect(canvas.width - frameWidth / 2, 0, frameWidth / 2, canvas.height)
    }

    // Draw double view (stretch) if enabled
    if (currentView === 'double') {
      // Create temporary canvas to copy current frame
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const tempCtx = tempCanvas.getContext('2d')
      tempCtx.drawImage(canvas, 0, 0)
      
      // Clear main canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw stretched frame twice side-by-side
      const halfWidth = canvas.width / 2
      const stretchScaleY = 1.4
      const stretchedHeight = canvas.height * stretchScaleY
      const offsetY = (canvas.height - stretchedHeight) / 2
      
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height, 0, offsetY, halfWidth, stretchedHeight)
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height, halfWidth, offsetY, halfWidth, stretchedHeight)
    }

    // Draw borders AFTER grid/double view transformations (and scale down in those modes)
    if (currentBorder !== 'none' && borderRef.current && currentBorder !== 'mothers_armpits') {
      const isGridOrDoubleMode = currentView === 'fourGrid' || currentView === 'double'
      
      if (isGridOrDoubleMode) {
        // Draw scaled borders in grid/double mode
        const borderImg = borderRef.current
        let borderOpacity = 1
        let borderScale = 1.1 // Default for grid/double

        if (currentBorder === 'film_frame') {
          borderOpacity = 0.8
          borderScale = 1.0
        }
        if (currentBorder === 'filter_border') {
          borderScale = 1.3
          borderOpacity = 1
        }
        if (currentBorder === 'katana_border') {
          borderScale = 1.1
        }

        const borderWidth = canvas.width * borderScale
        const borderHeight = canvas.height * borderScale
        const borderX = (canvas.width - borderWidth) / 2
        const borderY = (canvas.height - borderHeight) / 2

        ctx.globalAlpha = borderOpacity
        ctx.drawImage(borderImg, borderX, borderY, borderWidth, borderHeight)
        ctx.globalAlpha = 1.0
      }
    }

    // Draw blood splatter overlay if enabled (highest z-index)
    if (useBloodSplatter && bloodSplatterRef.current) {
      try {
        const splatterImg = bloodSplatterRef.current

        ctx.globalAlpha = 0.6
        ctx.globalCompositeOperation = 'multiply' // Darken blend mode
        
        if (currentView === 'double') {
          // Draw 2 smaller splatters on each side in double view
          const halfWidth = canvas.width / 2
          const splatterScale = 0.5 // Make smaller
          const splatterWidth = canvas.width * splatterScale
          const splatterHeight = canvas.height * splatterScale
          
          // Left side - two splatters
          const leftX1 = 50
          const leftX2 = halfWidth - splatterWidth - 50
          const topY = 100
          const bottomY = canvas.height - splatterHeight - 100
          
          ctx.drawImage(splatterImg, leftX1, topY, splatterWidth, splatterHeight)
          ctx.drawImage(splatterImg, leftX2, bottomY, splatterWidth, splatterHeight)
          
          // Right side - two splatters
          const rightX1 = halfWidth + 50
          const rightX2 = canvas.width - splatterWidth - 50
          ctx.drawImage(splatterImg, rightX1, topY, splatterWidth, splatterHeight)
          ctx.drawImage(splatterImg, rightX2, bottomY, splatterWidth, splatterHeight)
        } else {
          // Single splatter for normal/grid view
          const splatterScale = 1.2
          const splatterWidth = canvas.width * splatterScale
          const splatterHeight = canvas.height * splatterScale
          const splatterX = (canvas.width - splatterWidth) / 2 - 200
          const splatterY = (canvas.height - splatterHeight) / 2
          
          ctx.drawImage(splatterImg, splatterX, splatterY, splatterWidth, splatterHeight)
        }
        
        ctx.globalCompositeOperation = 'source-over' // Reset to default
        ctx.globalAlpha = 1.0
      } catch (error) {
        console.error('Blood splatter positioning error:', error)
      }
    }

    animationIdRef.current = requestAnimationFrame(drawFrame)
  }

  // Start drawing when webcam is active
  useEffect(() => {
    if (isWebcamActive && videoRef.current && videoRef.current.readyState === 4) {
      drawFrame()
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [isWebcamActive, offsetX, offsetY, scale, rotation, currentFilter, currentView, useHeartFilter, useBloodSplatter, currentBorder, showMichonneOverlay, useGrain, useSeptum, useEyebrow, useLip, useLabret, useNoseStud, useSpike, useBridge, useEyeGem, piercingAdjustments])

  // Compress canvas to JPEG for smaller file size
  const compressCanvasToJpeg = (canvas, quality = 0.7) => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob from canvas')
          resolve(null)
          return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target.result)
        }
        reader.onerror = () => {
          console.error('FileReader error')
          resolve(null)
        }
        reader.readAsDataURL(blob)
      }, 'image/jpeg', quality)
    })
  }

  // Capture and save canvas as image to local memory
  const capturePhoto = async () => {
    // Prevent concurrent captures (ignore spam clicks)
    if (isCapturingRef.current) {
      console.log('Capture already in progress, ignoring additional click')
      return
    }

    if (!canvasRef.current) {
      console.error('Canvas ref not available')
      return
    }

    isCapturingRef.current = true
    setIsCapturing(true)

    try {
      // Check if storage limit reached (50 images max)
      if (capturedImages.length >= 50) {
        setShowStorageLimitModal(true)
        return
      }

      // Play camera snap sound immediately
      if (cameraSnapAudioRef.current) {
        cameraSnapAudioRef.current.currentTime = 0
        cameraSnapAudioRef.current.play().catch((error) => {
          console.log('Could not play camera snap sound:', error)
        })
      }

      // Show capture notification immediately for instant feedback
      setCaptureNotification(true)
      setCaptureMessageIndex((prevIndex) => (prevIndex + 1) % CAPTURE_MESSAGES.length)
      setTimeout(() => setCaptureNotification(false), 2000)

      // Increment capture counter immediately
      captureCounterRef.current += 1
      localStorage.setItem('captureCounter', captureCounterRef.current.toString())

      // Compress image in background (non-blocking)
      const dataUrl = await compressCanvasToJpeg(canvasRef.current, 0.75)
      
      if (!dataUrl) {
        console.error('Failed to compress image')
        return
      }

      const newImage = {
        id: Date.now(),
        dataUrl: dataUrl,
        timestamp: new Date().toLocaleString(),
        name: `michonne_kisses_${captureCounterRef.current}`
      }
      
      // Get the latest images from localStorage
      const savedImages = localStorage.getItem('capturedImages')
      const allImages = savedImages ? JSON.parse(savedImages) : []
      const updatedImages = [newImage, ...allImages]
      
      try {
        localStorage.setItem('capturedImages', JSON.stringify(updatedImages))
        console.log('Image saved! Total images:', updatedImages.length)
        console.log('Compressed size:', (dataUrl.length / 1024).toFixed(1), 'KB')
      } catch (e) {
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          console.warn('LocalStorage quota exceeded! Keeping only newest 5 images...')
          // Keep only the 5 most recent images
          const recentImages = updatedImages.slice(0, 5)
          try {
            localStorage.setItem('capturedImages', JSON.stringify(recentImages))
            setCapturedImages(recentImages)
            setImageCount(recentImages.length)
            console.log('Trimmed to 5 most recent images')
          } catch (e2) {
            console.error('Still unable to save:', e2)
          }
          return
        }
      }
      
      setCapturedImages(updatedImages)
      setImageCount(updatedImages.length)
    } catch (error) {
      console.error('Error during capture:', error)
    } finally {
      isCapturingRef.current = false
      setIsCapturing(false)
    }
  }

  // Play click sound
  const playClickSound = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0
      clickAudioRef.current.play().catch((error) => {
        console.log('Could not play sound:', error)
      })
    }
  }

  // Color filter options and helpers
  const colorOptions = ['normal', 'blackAndWhite', 'tint']
  const colorLabels = ['Normal', 'B&W', 'Tint']

  // View options and helpers
  const viewOptions = ['normal', 'fourGrid', 'double']
  const viewLabels = ['Normal', '4 Grid', 'Double']

  // Helper to step through options
  const stepOption = (currentValue, options, step) => {
    const currentIndex = options.indexOf(currentValue)
    const newIndex = (currentIndex + step + options.length) % options.length
    return options[newIndex]
  }

  // Color filter step handler
  const handleColorStep = (step) => {
    const newFilter = stepOption(currentFilter, colorOptions, step)
    setCurrentFilter(newFilter)
    playClickSound()
  }

  // View step handler
  const handleViewStep = (step) => {
    const newView = stepOption(currentView, viewOptions, step)
    setCurrentView(newView)
    playClickSound()
  }

  // Handle capture with timer countdown
  const handleCaptureWithTimer = async () => {
    if (timerOption === 'none') {
      // No timer - capture immediately
      await capturePhoto()
      return
    }

    // Get the timer duration in seconds
    const timerDurations = { '3s': 3, '5s': 5, '10s': 10 }
    const duration = timerDurations[timerOption]
    
    if (!duration) return

    // Start countdown
    setCountdownValue(duration)
    let remaining = duration

    const countdownInterval = setInterval(() => {
      remaining -= 1
      setCountdownValue(remaining)

      if (remaining <= 0) {
        clearInterval(countdownInterval)
        setCountdownValue(0)
        // Capture after timer completes
        capturePhoto()
      }
    }, 1000)

    countdownIntervalRef.current = countdownInterval
  }

  // Handle camera icon click
  const handleCameraClick = () => {
    playClickSound()
    if (showKissCam) {
      // Close both Kiss Cam and Controls if Kiss Cam is already open
      setShowKissCam(false)
      setShowControls(false)
      stopWebcam()
    } else {
      // Open Kiss Cam
      setShowKissCam(true)
      setShowControls(false)
      if (!isWebcamActive) {
        startWebcam()
      }
    }
  }

  // Handle desktop icon click
  const handleDesktopIconClick = () => {
    playClickSound()
  }

  // Handle Downloads folder click
  const handleDownloadsFolderClick = () => {
    playClickSound()
    setShowDownloadsFolder(!showDownloadsFolder)
  }

  // Handle close Downloads folder
  const handleCloseDownloads = () => {
    playClickSound()
    setShowDownloadsFolder(false)
    // Don't close the image modal - they're independent
  }

  // Handle delete image
  const handleDeleteImage = (imageId) => {
    playClickSound()
    setImageToDelete(imageId)
  }

  // Confirm delete image
  const confirmDeleteImage = () => {
    playClickSound()

    // Find index BEFORE removing
    const deletedIndex = capturedImages.findIndex(
      (img) => img.id === imageToDelete
    )

    // Create new array without deleted image
    const updatedImages = capturedImages.filter(
      (img) => img.id !== imageToDelete
    )

    setCapturedImages(updatedImages)
    localStorage.setItem('capturedImages', JSON.stringify(updatedImages))

    // Handle modal image switching
    if (updatedImages.length > 0) {
      // Prefer next image, fallback to previous
      const nextIndex =
        deletedIndex < updatedImages.length
          ? deletedIndex
          : updatedImages.length - 1

      setSelectedImage(updatedImages[nextIndex])
    } else {
      // No images left → close modal
      setSelectedImage(null)
    }

    // Close confirmation dialog only
    setImageToDelete(null)
    setDownloadsPage(0)

    console.log('Image deleted! Remaining:', updatedImages.length)
  }

  // Cancel delete
  const cancelDeleteImage = () => {
    playClickSound()
    setImageToDelete(null)
  }

  // Delete all images
  const handleDeleteAllImages = () => {
    playClickSound()
    setCapturedImages([])
    localStorage.setItem('capturedImages', JSON.stringify([]))
    setSelectedImage(null)
    setDownloadsPage(0)
    setShowStorageLimitModal(false)
    setShowDeleteConfirm(false)
    console.log('All images deleted!')
  }

  // Save all images as ZIP without deleting
  const handleSaveAllAsZip = async () => {
    playClickSound()
    setIsSavingZip(true)
    try {
      const zip = new JSZip()
      const folder = zip.folder('michonne_captures')

      // Add each image to the ZIP
      for (let i = 0; i < capturedImages.length; i++) {
        const image = capturedImages[i]
        const base64Data = image.dataUrl.split(',')[1]
        folder.file(`${image.name}.jpg`, base64Data, { base64: true })
      }

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      
      // Download ZIP file
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `michonne_captures_${Date.now()}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Close modal after successful download
      setShowSaveAllModal(false)
    } catch (error) {
      console.error('Error creating ZIP file:', error)
      alert('Error creating ZIP file. Please try again.')
    } finally {
      setIsSavingZip(false)
    }
  }

  // Save all images as ZIP then delete
  const handleSaveAsZipThenDelete = async () => {
    playClickSound()
    setIsSavingZip(true)
    try {
      const zip = new JSZip()
      const folder = zip.folder('michonne_captures')

      // Add each image to the ZIP
      for (let i = 0; i < capturedImages.length; i++) {
        const image = capturedImages[i]
        const base64Data = image.dataUrl.split(',')[1]
        folder.file(`${image.name}.jpg`, base64Data, { base64: true })
      }

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      
      // Download ZIP file
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `michonne_captures_${Date.now()}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Delete all images after successful download
      handleDeleteAllImages()
    } catch (error) {
      console.error('Error creating ZIP file:', error)
      alert('Error creating ZIP file. Please try again.')
    } finally {
      setIsSavingZip(false)
    }
  }

  // Handle music player toggle
  const handleMusicClick = () => {
    playClickSound()
    setShowMusicPlayer(!showMusicPlayer)
  }

  // Handle Purple Palace click
  const handlePurplePalaceClick = () => {
    playClickSound()
    setShowPurplePalace(!showPurplePalace)
  }

  // Handle close Purple Palace
  const handleClosePurplePalace = () => {
    playClickSound()
    setShowPurplePalace(false)
  }

  // Handle play/pause music
  const handlePlayPauseMusic = () => {
    playClickSound()
    if (isMusciPlaying) {
      bgMusicRef.current?.pause()
      setIsMusicPlaying(false)
    } else {
      bgMusicRef.current?.play()
      setIsMusicPlaying(true)
    }
  }

  // Handle next song
  const handleNextSong = () => {
    playClickSound()
    setReplayCurrentSong(false)
    const nextIndex = (currentSongIndex + 1) % PLAYLIST.length
    setCurrentSongIndex(nextIndex)
    setSliderPosition(0)
    setAudioCurrentTime(0)
    if (bgMusicRef.current) {
      bgMusicRef.current.pause()
      bgMusicRef.current.currentTime = 0
      bgMusicRef.current.src = PLAYLIST[nextIndex].file
      bgMusicRef.current.load()
      // Auto-play the next song
      setTimeout(() => {
        bgMusicRef.current?.play().catch(err => console.log('Play error:', err))
        setIsMusicPlaying(true)
      }, 100)
    }
  }

  // Handle previous song
  const handlePreviousSong = () => {
    playClickSound()
    setReplayCurrentSong(false)
    const prevIndex = (currentSongIndex - 1 + PLAYLIST.length) % PLAYLIST.length
    setCurrentSongIndex(prevIndex)
    setSliderPosition(0)
    setAudioCurrentTime(0)
    if (bgMusicRef.current) {
      bgMusicRef.current.pause()
      bgMusicRef.current.currentTime = 0
      bgMusicRef.current.src = PLAYLIST[prevIndex].file
      bgMusicRef.current.load()
      // Auto-play the previous song
      setTimeout(() => {
        bgMusicRef.current?.play().catch(err => console.log('Play error:', err))
        setIsMusicPlaying(true)
      }, 100)
    }
  }

  // Handle close music player
  const handleCloseMusicPlayer = () => {
    playClickSound()
    setShowMusicPlayer(false)
  }

  // Handle trash icon click
  const handleTrashClick = () => {
    playClickSound()
    setShowTrash(!showTrash)
  }

  // Handle close trash
  const handleCloseTrash = () => {
    playClickSound()
    setShowTrash(false)
  }

  // Move image to trash
  const moveImageToTrash = (imageId) => {
    const imageToMove = capturedImages.find((img) => img.id === imageId)
    if (imageToMove) {
      if (trashAudioRef.current) {
        trashAudioRef.current.currentTime = 0
        trashAudioRef.current.volume = 1.0
        trashAudioRef.current.playbackRate = 1.5
        trashAudioRef.current.play().catch((error) => {
          console.log('Could not play trash sound:', error)
        })
      }
      const updatedTrash = [...trashedImages, imageToMove]
      setTrashedImages(updatedTrash)
      localStorage.setItem('trashedImages', JSON.stringify(updatedTrash))
      
      const updatedImages = capturedImages.filter((img) => img.id !== imageId)
      setCapturedImages(updatedImages)
      localStorage.setItem('capturedImages', JSON.stringify(updatedImages))
      
      // If the moved image was selected, transition to next image instead of closing modal
      if (selectedImage?.id === imageId) {
        if (updatedImages.length > 0) {
          const movedIndex = capturedImages.findIndex((img) => img.id === imageId)
          const nextIndex = 
            movedIndex < updatedImages.length 
              ? movedIndex 
              : updatedImages.length - 1
          setSelectedImage(updatedImages[nextIndex])
        } else {
          // No images left, close modal
          setSelectedImage(null)
        }
      }
    }
  }

  // Restore image from trash
  const restoreImageFromTrash = (imageId) => {
    playClickSound()
    const imageToRestore = trashedImages.find((img) => img.id === imageId)
    if (imageToRestore) {
      // Find index BEFORE removing (from original array)
      const restoredIndex = trashedImages.findIndex((img) => img.id === imageId)
      
      // Ensure all properties are preserved, especially the name
      const restoredImage = { ...imageToRestore }
      const updatedCaptured = [restoredImage, ...capturedImages]
      const updatedTrash = trashedImages.filter((img) => img.id !== imageId)
      
      setCapturedImages(updatedCaptured)
      setDownloadsPage(0)
      localStorage.setItem('capturedImages', JSON.stringify(updatedCaptured))
      localStorage.setItem('trashedImages', JSON.stringify(updatedTrash))
      
      // Keep modal open and switch to next trash image
      if (updatedTrash.length > 0) {
        const nextIndex = 
          restoredIndex < updatedTrash.length 
            ? restoredIndex 
            : updatedTrash.length - 1
        setSelectedTrashImage(updatedTrash[nextIndex])
      } else {
        // Only close modal when no images left
        setSelectedTrashImage(null)
      }
      
      setTrashedImages(updatedTrash)
    }
  }

  // Permanently delete from trash
  const confirmPermanentDeleteImage = () => {
    playClickSound()
    if (trashAudioRef.current) {
      trashAudioRef.current.currentTime = 0
      trashAudioRef.current.volume = 1.0
      trashAudioRef.current.playbackRate = 1.5
      trashAudioRef.current.play().catch((error) => {
        console.log('Could not play trash sound:', error)
      })
    }
    
    // Find index BEFORE removing (from original array)
    const deletedIndex = trashedImages.findIndex(
      (img) => img.id === imageToDeletePermanently
    )
    
    // Create new array without deleted image
    const updatedTrash = trashedImages.filter(
      (img) => img.id !== imageToDeletePermanently
    )
    
    // Keep modal open and switch to next trash image if available
    if (updatedTrash.length > 0) {
      const nextIndex =
        deletedIndex < updatedTrash.length
          ? deletedIndex
          : updatedTrash.length - 1
      setSelectedTrashImage(updatedTrash[nextIndex])
    } else {
      // Only close modal when no images left
      setSelectedTrashImage(null)
    }
    
    // Update state + storage
    setTrashedImages(updatedTrash)
    localStorage.setItem('trashedImages', JSON.stringify(updatedTrash))
    
    // Close confirmation dialog only
    setImageToDeletePermanently(null)
    setTrashPage(0)
  }

  // Cancel permanent delete
  const cancelPermanentDeleteImage = () => {
    playClickSound()
    setImageToDeletePermanently(null)
  }

  // Clear all trash
  const clearAllTrash = () => {
    playClickSound()
    if (trashAudioRef.current) {
      trashAudioRef.current.currentTime = 0
      trashAudioRef.current.volume = 1.0
      trashAudioRef.current.playbackRate = 1.5
      trashAudioRef.current.play().catch(() => {})
    }
    setTrashedImages([])
    setSelectedTrashImage(null)
    setTrashPage(0)
    localStorage.setItem('trashedImages', JSON.stringify([]))
    setConfirmClearTrash(false)
  }

  // Cancel clear trash
  const cancelClearTrash = () => {
    playClickSound()
    setConfirmClearTrash(false)
  }

  // Auto-hide controls when navigating to None or an unticked piercing
  useEffect(() => {
    const piercingStates = {
      1: useSeptum,
      2: useEyebrow,
      3: useLabret,
      4: useLip,
      5: useSpike,
      6: useNoseStud,
      7: useBridge,
      8: useEyeGem
    }
    if ((piercingPage === 0 || !piercingStates[piercingPage]) && showPiercingControls) {
      setShowPiercingControls(false)
    }
  }, [piercingPage, useSeptum, useEyebrow, useLabret, useLip, useSpike, useNoseStud, useBridge, useEyeGem, showPiercingControls])

  const handleMouseDown = (e, windowType, currentPos) => {
    if (e.button !== 0) return // Only left mouse button
    const startX = e.clientX - currentPos.x
    const startY = e.clientY - currentPos.y
    setDragState({
      window: windowType,
      startX,
      startY
    })
  }

  // Handle mouse move for dragging
  useEffect(() => {
    if (!dragState && !draggedImageId) return

    const handleMouseMove = (e) => {
      if (dragState) {
        const newX = e.clientX - dragState.startX
        const newY = e.clientY - dragState.startY

        if (dragState.window === 'kissCam') {
          setKissCamPos({ x: newX, y: newY })
        } else if (dragState.window === 'downloads') {
          setDownloadsPos({ x: newX, y: newY })
        } else if (dragState.window === 'musicPlayer') {
          setMusicPlayerPos({ x: newX, y: newY })
        } else if (dragState.window === 'controlsWindow') {
          setControlsWindowPos({ x: newX, y: newY })
        } else if (dragState.window === 'piercingControlsWindow') {
          setPiercingControlsPos({ x: newX, y: newY })
        } else if (dragState.window === 'trash') {
          setTrashPos({ x: newX, y: newY })
        } else if (dragState.window === 'purplePalace') {
          setPurplePalacePos({ x: newX, y: newY })
        } else if (dragState.window === 'notification') {
          setCaptureNotificationPos({ x: newX, y: newY })
        }
      } else if (draggedImageId) {
        setDragImagePos({ x: e.clientX - 30, y: e.clientY - 30 })
      }
    }

    const handleMouseUp = (e) => {
      if (draggedImageId) {
        // Check if dropped on desktop icons
        const trashIconRect = document.getElementById('trash-icon')?.getBoundingClientRect()
        const downloadsIconRect = document.getElementById('downloads-icon')?.getBoundingClientRect()
        
        // Check if dropped on open windows
        const downloadsWindowRect = document.getElementById('downloads-window')?.getBoundingClientRect()
        const trashWindowRect = document.getElementById('trash-window')?.getBoundingClientRect()
        
        // From downloads to trash (icon or window)
        if (dragImageSource === 'downloads') {
          const droppedOnTrashIcon = trashIconRect &&
            e.clientX >= trashIconRect.left &&
            e.clientX <= trashIconRect.right &&
            e.clientY >= trashIconRect.top &&
            e.clientY <= trashIconRect.bottom
          
          const droppedOnTrashWindow = trashWindowRect &&
            e.clientX >= trashWindowRect.left &&
            e.clientX <= trashWindowRect.right &&
            e.clientY >= trashWindowRect.top &&
            e.clientY <= trashWindowRect.bottom
          
          if (droppedOnTrashIcon || droppedOnTrashWindow) {
            moveImageToTrash(draggedImageId)
          }
        } 
        // From trash to downloads (icon or window)
        else if (dragImageSource === 'trash') {
          const droppedOnDownloadsIcon = downloadsIconRect &&
            e.clientX >= downloadsIconRect.left &&
            e.clientX <= downloadsIconRect.right &&
            e.clientY >= downloadsIconRect.top &&
            e.clientY <= downloadsIconRect.bottom
          
          const droppedOnDownloadsWindow = downloadsWindowRect &&
            e.clientX >= downloadsWindowRect.left &&
            e.clientX <= downloadsWindowRect.right &&
            e.clientY >= downloadsWindowRect.top &&
            e.clientY <= downloadsWindowRect.bottom
          
          if (droppedOnDownloadsIcon || droppedOnDownloadsWindow) {
            restoreImageFromTrash(draggedImageId)
          }
        }
        setDraggedImageId(null)
        setDragImageSource(null)
      }
      
      setDragState(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragState, draggedImageId])

  // Handle close button
  const handleCloseKissCam = () => {
    playClickSound()
    setShowKissCam(false)
    stopWebcam()
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} onLogout={() => setIsLoggedIn(false)} />
  }

  return (
    <div style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      cursor: `url(${cursorImg}) 4 12, auto`,
      backgroundColor: '#0000aa'
    }}>
      <audio ref={clickAudioRef} src={clickSound} />
      <audio ref={cameraSnapAudioRef} src={cameraSnapSound} />
      <audio ref={bgMusicRef} src={PLAYLIST[currentSongIndex].file} onEnded={() => {
        if (replayCurrentSong) {
          if (bgMusicRef.current) {
            bgMusicRef.current.currentTime = 0
            bgMusicRef.current.play()
          }
        } else {
          handleNextSong()
        }
      }} />
      <audio ref={trashAudioRef} src={trashSound} />

      {/* Loading message - appears while images are loading */}
      {!bgImagesLoaded && (
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
          Wait for bg image to fully load before clicking anything!
        </div>
      )}

      {/* Hidden img element to track when background image loads */}
      <img src={bgImage} onLoad={() => setBgImageLoaded(true)} style={{ display: 'none' }} alt="bg" />

      {showDesktop ? (
        // Desktop view with folders and camera icon - Two columns layout
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '80px',
          padding: '20px',
          height: '100%',
          width: '100%'
        }}>
          {/* Column 1 - Downloads, Music.mp3, Purple Palace */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            alignItems: 'flex-start'
          }}>
            {/* Downloads Folder */}
            <div 
              id="downloads-icon"
              onClick={handleDownloadsFolderClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📁</div>
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Downloads</div>
            </div>

            {/* Music.mp3 */}
            <div 
              onClick={handleMusicClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎵</div>
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Music.mp3</div>
            </div>

            {/* Purple Palace */}
            <div 
              onClick={handlePurplePalaceClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
              }}
            >
              <img 
                src={purblePalaceLogo}
                alt="Purple Palace"
                style={{
                  width: '48px',
                  height: '48px',
                  objectFit: 'contain'
                }}
              />
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Purble Palace</div>
            </div>
          </div>

          {/* Column 2 - Kiss Cam, Letterboxd, Trash */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            alignItems: 'flex-start'
          }}>
            {/* Kiss Cam */}
            <div 
              onClick={handleCameraClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
              }}
            >
              <div style={{ 
                fontSize: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'scale(1)',
                transition: 'transform 0.1s'
              }}>📷</div>
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Kiss Cam</div>
            </div>

            {/* Letterboxd */}
            <div 
              onClick={() => {
                playClickSound()
                window.open('https://dellulli.github.io/memory-room/letterboxd', '_blank')
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
              }}
            >
              <img 
                src={letterboxdLogo}
                alt="Letterboxd"
                style={{
                  width: '56px',
                  height: '56px',
                  objectFit: 'contain'
                }}
              />
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Letterboxd</div>
            </div>

            {/* Trash */}
            <div 
              id="trash-icon"
              onClick={handleTrashClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
              }}
            >
              <img 
                src={trashedImages.length > 0 ? fullBinImg : emptyBinImg}
                alt="Trash"
                style={{
                  width: '56px',
                  height: '56px',
                  objectFit: 'contain'
                }}
              />
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Trash</div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Capture Notification Toast */}
      {captureNotification && (
        <div 
          style={{
            position: 'fixed',
            top: `${captureNotificationPos.y}px`,
            right: 'auto',
            left: `${captureNotificationPos.x}px`,
            backgroundColor: '#000080',
            color: '#ffff00',
            padding: '12px 20px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 9999,
            border: '2px solid #ffff00',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            animation: 'slideIn 0.3s ease-in-out',
            cursor: dragState?.window === 'notification' ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'notification', captureNotificationPos)}
        >
          {CAPTURE_MESSAGES[captureMessageIndex]}
        </div>
      )}

      {/* Kiss Cam Modal */}
      {showKissCam && (
        <animated.div style={{
          ...fadeProps,
          position: 'fixed',
          top: `${kissCamPos.y}px`,
          left: `${kissCamPos.x}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          gap: '15px',
          zIndex: 1000
        }}>
          <div className="main-container">
            <div 
              className="title"
              onMouseDown={(e) => handleMouseDown(e, 'kissCam', kissCamPos)}
              style={{ 
                cursor: dragState?.window === 'kissCam' ? 'grabbing' : 'grab',
                borderBottom: dragState?.window === 'kissCam' ? '2px solid #ffffff' : 'none'
              }}
            >
              <h1>💋 Kiss Cam</h1>
              <button 
                onClick={handleCloseKissCam}
                style={{
                  marginLeft: 'auto',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  outline: 'none',
                  backgroundColor: '#d85c5c'
                }}
              >
                ✕
              </button>
            </div>

            <div className="container-inner webcam-main">
              {cameraError && (
                <div className="error-message">
                  ⚠️ {cameraError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div className="canvas-container" style={{ position: 'relative' }}>
                  <canvas
                    ref={canvasRef}
                    className="webcam-canvas"
                    style={{ 
                      display: 'block',
                      backgroundColor: isWebcamActive ? 'transparent' : '#000000'
                    }}
                  />
                  {/* Timer countdown overlay - centered on webcam */}
                  {countdownValue > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '120px',
                      fontWeight: 'bold',
                      color: 'white',
                      textShadow: '0 0 20px rgba(0, 0, 0, 0.8)',
                      zIndex: 9999,
                      userSelect: 'none'
                    }}>
                      {countdownValue}
                    </div>
                  )}
                </div>

                {/* Filter Options Panel */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: '#c0c0c0',
                  border: '1px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  borderRadius: '2px'
                }}>
                  {/* Colour Heading */}
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: '#000080'
                  }}>
                    Colour:
                  </div>

                  {/* Color Filter Selector */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '5px'
                  }}>
                    <button
                      onClick={() => handleColorStep(-1)}
                      disabled={!isWebcamActive}
                      style={{
                        width: '20px',
                        height: '20px',
                        padding: '0',
                        fontSize: '10px',
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        backgroundColor: isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                        border: '2px solid',
                        borderColor: isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                        color: '#000080',
                        fontWeight: 'bold',
                        opacity: isWebcamActive ? 1 : 0.5,
                        outline: 'none'
                      }}
                    >
                      &lt;
                    </button>
                    <span style={{ fontSize: '11px', minWidth: '45px', textAlign: 'center', color: '#000000' }}>
                      {colorLabels[colorOptions.indexOf(currentFilter)]}
                    </span>
                    <button
                      onClick={() => handleColorStep(1)}
                      disabled={!isWebcamActive}
                      style={{
                        width: '20px',
                        height: '20px',
                        padding: '0',
                        fontSize: '10px',
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        backgroundColor: isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                        border: '2px solid',
                        borderColor: isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                        color: '#000080',
                        fontWeight: 'bold',
                        opacity: isWebcamActive ? 1 : 0.5,
                        outline: 'none'
                      }}
                    >
                      &gt;
                    </button>
                  </div>

                  {/* Add-Ons Heading */}
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginTop: '12px',
                    marginBottom: '8px',
                    color: '#000080'
                  }}>
                    Add-Ons ☆
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'space-between'
                  }}>
                    {/* Left Arrow */}
                    <button
                      onClick={() => {
                        playClickSound()
                        setAddOnPage((prev) => (prev === 0 ? 2 : prev - 1))
                      }}
                      disabled={!isWebcamActive}
                      style={{
                        width: '20px',
                        height: '20px',
                        padding: '0',
                        fontSize: '10px',
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        backgroundColor: isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                        border: '2px solid',
                        borderColor: isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                        color: '#000080',
                        fontWeight: 'bold',
                        opacity: isWebcamActive ? 1 : 0.5,
                        outline: 'none'
                      }}
                    >
                      &lt;
                    </button>

                    {/* Add-On Item - Dynamic based on addOnPage */}
                    {addOnPage === 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}>
                        <input type="checkbox" id="grainToggle" checked={useGrain} onChange={(e) => { playClickSound(); setUseGrain(e.target.checked) }} disabled={!isWebcamActive} style={{ cursor: isWebcamActive ? 'pointer' : 'not-allowed', width: '10px', height: '10px', opacity: isWebcamActive ? 1 : 0.5 }} />
                        <label htmlFor="grainToggle" style={{ fontSize: '8px', cursor: isWebcamActive ? 'pointer' : 'not-allowed', userSelect: 'none', opacity: isWebcamActive ? 1 : 0.5, maxWidth: '25px', wordWrap: 'break-word' }}>Film Grain</label>
                      </div>
                    )}
                    {addOnPage === 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}>
                        <input type="checkbox" id="heartToggle" checked={useHeartFilter} onChange={(e) => { playClickSound(); setUseHeartFilter(e.target.checked) }} disabled={!isWebcamActive} style={{ cursor: isWebcamActive ? 'pointer' : 'not-allowed', width: '10px', height: '10px', opacity: isWebcamActive ? 1 : 0.5 }} />
                        <label htmlFor="heartToggle" style={{ fontSize: '8px', cursor: isWebcamActive ? 'pointer' : 'not-allowed', userSelect: 'none', opacity: isWebcamActive ? 1 : 0.5, maxWidth: '40px', wordWrap: 'break-word' }}>Hearts ♥</label>
                      </div>
                    )}
                    {addOnPage === 2 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}>
                        <input type="checkbox" id="bloodSplatterToggle" checked={useBloodSplatter} onChange={(e) => { playClickSound(); setUseBloodSplatter(e.target.checked) }} disabled={!isWebcamActive} style={{ cursor: isWebcamActive ? 'pointer' : 'not-allowed', width: '10px', height: '10px', opacity: isWebcamActive ? 1 : 0.5 }} />
                        <label htmlFor="bloodSplatterToggle" style={{ fontSize: '8px', cursor: isWebcamActive ? 'pointer' : 'not-allowed', userSelect: 'none', opacity: isWebcamActive ? 1 : 0.5, maxWidth: '40px', wordWrap: 'break-word' }}>Blood</label>
                      </div>
                    )}

                    {/* Right Arrow */}
                    <button
                      onClick={() => {
                        playClickSound()
                        setAddOnPage((prev) => (prev === 2 ? 0 : prev + 1))
                      }}
                      disabled={!isWebcamActive}
                      style={{
                        width: '20px',
                        height: '20px',
                        padding: '0',
                        fontSize: '10px',
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        backgroundColor: isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                        border: '2px solid',
                        borderColor: isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                        color: '#000080',
                        fontWeight: 'bold',
                        opacity: isWebcamActive ? 1 : 0.5,
                        outline: 'none'
                      }}
                    >
                      &gt;
                    </button>
                  </div>

                  {/* View Heading */}
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginTop: '12px',
                    marginBottom: '8px',
                    color: '#000080'
                  }}>
                    View:
                  </div>

                  {/* View Selector */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <button
                      onClick={() => handleViewStep(-1)}
                      disabled={!isWebcamActive}
                      style={{
                        width: '20px',
                        height: '20px',
                        padding: '0',
                        fontSize: '10px',
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        backgroundColor: isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                        border: '2px solid',
                        borderColor: isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                        color: '#000080',
                        fontWeight: 'bold',
                        opacity: isWebcamActive ? 1 : 0.5,
                        outline: 'none'
                      }}
                    >
                      &lt;
                    </button>
                    <span style={{ fontSize: '11px', minWidth: '50px', textAlign: 'center', color: '#000000' }}>
                      {viewLabels[viewOptions.indexOf(currentView)]}
                    </span>
                    <button
                      onClick={() => handleViewStep(1)}
                      disabled={!isWebcamActive}
                      style={{
                        width: '20px',
                        height: '20px',
                        padding: '0',
                        fontSize: '10px',
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        backgroundColor: isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                        border: '2px solid',
                        borderColor: isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                        color: '#000080',
                        fontWeight: 'bold',
                        opacity: isWebcamActive ? 1 : 0.5,
                        outline: 'none'
                      }}
                    >
                      &gt;
                    </button>
                  </div>

                  {/* Border Selection */}
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', color: '#000080', opacity: isWebcamActive ? 1 : 0.5 }}>Borders:</div>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <button
                        onClick={() => {
                          const options = ['none', 'film_frame', 'filter_border', 'katana_border', 'mothers_armpits']
                          const currentIndex = options.indexOf(currentBorder)
                          const newIndex = (currentIndex - 1 + options.length) % options.length
                          setCurrentBorder(options[newIndex])
                          playClickSound()
                        }}
                        disabled={!isWebcamActive}
                        style={{
                          width: '20px',
                          height: '20px',
                          padding: '0',
                          fontSize: '10px',
                          cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                          backgroundColor: isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                          border: '2px solid',
                          borderColor: isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                          color: '#000080',
                          fontWeight: 'bold',
                          opacity: isWebcamActive ? 1 : 0.5,
                          outline: 'none'
                        }}
                      >
                        &lt;
                      </button>
                      <span style={{ fontSize: '11px', minWidth: '60px', textAlign: 'center' }}>
                        {currentBorder === 'none' ? 'None' :
                         currentBorder === 'film_frame' ? 'Film' :
                         currentBorder === 'filter_border' ? 'Waifus' :
                         currentBorder === 'katana_border' ? 'Katana' : <span style={{ fontSize: '8px' }}>Mother's Armpits</span>}
                      </span>
                      <button
                        onClick={() => {
                          const options = ['none', 'film_frame', 'filter_border', 'katana_border', 'mothers_armpits']
                          const currentIndex = options.indexOf(currentBorder)
                          const newIndex = (currentIndex + 1) % options.length
                          setCurrentBorder(options[newIndex])
                          playClickSound()
                        }}
                        disabled={!isWebcamActive}
                        style={{
                          width: '20px',
                          height: '20px',
                          padding: '0',
                          fontSize: '10px',
                          cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                          backgroundColor: isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                          border: '2px solid',
                          borderColor: isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                          color: '#000080',
                          fontWeight: 'bold',
                          opacity: isWebcamActive ? 1 : 0.5,
                          outline: 'none'
                        }}
                      >
                        &gt;
                      </button>
                    </div>
                  </div>

                  {/* Michonne Overlay Toggle */}
                  <div style={{ marginTop: '10px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: '#000080'
                      }}>
                        Piercings
                      </div>
                      {piercingPage !== 0 && (() => {
                        const piercingStates = {
                          1: useSeptum,
                          2: useEyebrow,
                          3: useLabret,
                          4: useLip,
                          5: useSpike,
                          6: useNoseStud,
                          7: useBridge,
                          8: useEyeGem
                        };
                        const isPiercingEnabled = piercingStates[piercingPage];
                        const isButtonDisabled = !isWebcamActive || !isPiercingEnabled;
                        return (
                          <button
                            onClick={() => {
                              playClickSound()
                              setShowPiercingControls(!showPiercingControls)
                            }}
                            disabled={isButtonDisabled}
                            style={{
                              padding: '2px 8px',
                              fontSize: '9px',
                              cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                              backgroundColor: isButtonDisabled ? '#a0a0a0' : '#c0c0c0',
                              border: '2px solid',
                              borderColor: isButtonDisabled ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
                              color: '#000080',
                              fontWeight: 'bold',
                              opacity: isButtonDisabled ? 0.5 : 1,
                              outline: 'none'
                            }}
                          >
                            Controls
                          </button>
                        );
                      })()}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      justifyContent: 'space-between'
                    }}>
                      {/* Left Arrow */}
                      <button
                        onClick={() => {
                          playClickSound()
                          setPiercingPage((prev) => (prev === 0 ? 8 : prev - 1))
                        }}
                        disabled={!isWebcamActive}
                        style={{
                          width: '20px',
                          height: '20px',
                          padding: '0',
                          fontSize: '10px',
                          cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                          backgroundColor: isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                          border: '2px solid',
                          borderColor: isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                          color: '#000080',
                          fontWeight: 'bold',
                          opacity: isWebcamActive ? 1 : 0.5,
                          outline: 'none'
                        }}
                      >
                        &lt;
                      </button>

                      {/* Piercing Item - Dynamic based on piercingPage */}
                      {piercingPage === 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}>
                          <input type="checkbox" id="noPiercingsToggle" checked={!useSeptum && !useEyebrow && !useLip && !useLabret && !useNoseStud && !useSpike && !useEyeGem} onChange={(e) => { playClickSound(); if (e.target.checked) { setUseSeptum(false); setUseEyebrow(false); setUseLip(false); setUseLabret(false); setUseNoseStud(false); setUseSpike(false); setUseEyeGem(false) } }} disabled={!isWebcamActive} style={{ cursor: isWebcamActive ? 'pointer' : 'not-allowed', width: '10px', height: '10px', opacity: isWebcamActive ? 1 : 0.5 }} />
                          <label htmlFor="noPiercingsToggle" style={{ fontSize: '8px', cursor: isWebcamActive ? 'pointer' : 'not-allowed', userSelect: 'none', opacity: isWebcamActive ? 1 : 0.5, maxWidth: '40px', wordWrap: 'break-word' }}>None</label>
                        </div>
                      )}
                      {piercingPage === 1 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}>
                          <input type="checkbox" id="septumToggle" checked={useSeptum} onChange={(e) => { playClickSound(); setUseSeptum(e.target.checked) }} disabled={!isWebcamActive} style={{ cursor: isWebcamActive ? 'pointer' : 'not-allowed', width: '10px', height: '10px', opacity: isWebcamActive ? 1 : 0.5 }} />
                          <label htmlFor="septumToggle" style={{ fontSize: '8px', cursor: isWebcamActive ? 'pointer' : 'not-allowed', userSelect: 'none', opacity: isWebcamActive ? 1 : 0.5, maxWidth: '40px', wordWrap: 'break-word' }}>Septum</label>
                        </div>
                      )}
                      {piercingPage === 2 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}>
                          <input type="checkbox" id="eyebrowToggle" checked={useEyebrow} onChange={(e) => { playClickSound(); setUseEyebrow(e.target.checked) }} disabled={!isWebcamActive} style={{ cursor: isWebcamActive ? 'pointer' : 'not-allowed', width: '10px', height: '10px', opacity: isWebcamActive ? 1 : 0.5 }} />
                          <label htmlFor="eyebrowToggle" style={{ fontSize: '8px', cursor: isWebcamActive ? 'pointer' : 'not-allowed', userSelect: 'none', opacity: isWebcamActive ? 1 : 0.5, maxWidth: '40px', wordWrap: 'break-word' }}>Eyebrow</label>
                        </div>
                      )}
                      {piercingPage === 3 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}>
                          <input type="checkbox" id="labretToggle" checked={useLabret} onChange={(e) => { playClickSound(); setUseLabret(e.target.checked) }} disabled={!isWebcamActive} style={{ cursor: isWebcamActive ? 'pointer' : 'not-allowed', width: '10px', height: '10px', opacity: isWebcamActive ? 1 : 0.5 }} />
                          <label htmlFor="labretToggle" style={{ fontSize: '8px', cursor: isWebcamActive ? 'pointer' : 'not-allowed', userSelect: 'none', opacity: isWebcamActive ? 1 : 0.5, maxWidth: '40px', wordWrap: 'break-word' }}>Labret</label>
                        </div>
                      )}
                      {piercingPage === 4 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}>
                          <input type="checkbox" id="lipToggle" checked={useLip} onChange={(e) => { playClickSound(); setUseLip(e.target.checked) }} disabled={!isWebcamActive} style={{ cursor: isWebcamActive ? 'pointer' : 'not-allowed', width: '10px', height: '10px', opacity: isWebcamActive ? 1 : 0.5 }} />
                          <label htmlFor="lipToggle" style={{ fontSize: '8px', cursor: isWebcamActive ? 'pointer' : 'not-allowed', userSelect: 'none', opacity: isWebcamActive ? 1 : 0.5, maxWidth: '40px', wordWrap: 'break-word' }}>Lip</label>
                        </div>
                      )}
                      {piercingPage === 5 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}>
                          <input type="checkbox" id="spikeToggle" checked={useSpike} onChange={(e) => { playClickSound(); setUseSpike(e.target.checked) }} disabled={!isWebcamActive} style={{ cursor: isWebcamActive ? 'pointer' : 'not-allowed', width: '10px', height: '10px', opacity: isWebcamActive ? 1 : 0.5 }} />
                          <label htmlFor="spikeToggle" style={{ fontSize: '8px', cursor: isWebcamActive ? 'pointer' : 'not-allowed', userSelect: 'none', opacity: isWebcamActive ? 1 : 0.5, maxWidth: '40px', wordWrap: 'break-word' }}>Spikes</label>
                        </div>
                      )}
                      {piercingPage === 6 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}>
                          <input type="checkbox" id="noseStudToggle" checked={useNoseStud} onChange={(e) => { playClickSound(); setUseNoseStud(e.target.checked) }} disabled={!isWebcamActive} style={{ cursor: isWebcamActive ? 'pointer' : 'not-allowed', width: '10px', height: '10px', opacity: isWebcamActive ? 1 : 0.5 }} />
                          <label htmlFor="noseStudToggle" style={{ fontSize: '8px', cursor: isWebcamActive ? 'pointer' : 'not-allowed', userSelect: 'none', opacity: isWebcamActive ? 1 : 0.5, maxWidth: '40px', wordWrap: 'break-word' }}>Nose</label>
                        </div>
                      )}
                      {piercingPage === 7 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}>
                          <input type="checkbox" id="bridgeToggle" checked={useBridge} onChange={(e) => { playClickSound(); setUseBridge(e.target.checked) }} disabled={!isWebcamActive} style={{ cursor: isWebcamActive ? 'pointer' : 'not-allowed', width: '10px', height: '10px', opacity: isWebcamActive ? 1 : 0.5 }} />
                          <label htmlFor="bridgeToggle" style={{ fontSize: '8px', cursor: isWebcamActive ? 'pointer' : 'not-allowed', userSelect: 'none', opacity: isWebcamActive ? 1 : 0.5, maxWidth: '40px', wordWrap: 'break-word' }}>Bridge</label>
                        </div>
                      )}
                      {piercingPage === 8 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}>
                          <input type="checkbox" id="eyeGemToggle" checked={useEyeGem} onChange={(e) => { playClickSound(); setUseEyeGem(e.target.checked) }} disabled={!isWebcamActive} style={{ cursor: isWebcamActive ? 'pointer' : 'not-allowed', width: '10px', height: '10px', opacity: isWebcamActive ? 1 : 0.5 }} />
                          <label htmlFor="eyeGemToggle" style={{ fontSize: '8px', cursor: isWebcamActive ? 'pointer' : 'not-allowed', userSelect: 'none', opacity: isWebcamActive ? 1 : 0.5, maxWidth: '40px', wordWrap: 'break-word' }}>Eye Gem</label>
                        </div>
                      )}

                      {/* Right Arrow */}
                      <button
                        onClick={() => {
                          playClickSound()
                          setPiercingPage((prev) => (prev === 8 ? 0 : prev + 1))
                        }}
                        disabled={!isWebcamActive}
                        style={{
                          width: '20px',
                          height: '20px',
                          padding: '0',
                          fontSize: '10px',
                          cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                          backgroundColor: isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                          border: '2px solid',
                          borderColor: isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                          color: '#000080',
                          fontWeight: 'bold',
                          opacity: isWebcamActive ? 1 : 0.5,
                          outline: 'none'
                        }}
                      >
                        &gt;
                      </button>
                    </div>
                  </div>

                  {/* Michonne Overlay Toggle */}
                  <div style={{ marginTop: '10px' }}>
                    <input
                      type="checkbox"
                      id="michonneToggle"
                      checked={showMichonneOverlay}
                      onChange={(e) => {
                        setShowMichonneOverlay(e.target.checked)
                        playClickSound()
                      }}
                      disabled={!isWebcamActive}
                      style={{
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        width: '14px',
                        height: '14px',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    />
                    <label
                      htmlFor="michonneToggle"
                      style={{
                        fontSize: '11px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        marginLeft: '5px'
                      }}
                    >
                      Michonne
                    </label>
                  </div>

                  {/* Reset Controls Button */}
                  <button
                    onClick={() => {
                      playClickSound()
                      setUseGrain(true)
                      setShowMichonneOverlay(true)
                      setCurrentView('normal')
                      setCurrentFilter('normal')
                      setUseHeartFilter(false)
                      setUseBloodSplatter(false)
                      setCurrentBorder('none')
                      setUseSeptum(false)
                      setUseEyebrow(false)
                      setUseLip(false)
                      setUseLabret(false)
                      setUseNoseStud(false)
                      setUseSpike(false)
                      setUseBridge(false)
                      setUseEyeGem(false)
                      setPiercingPage(0)
                    }}
                    style={{
                      marginTop: '15px',
                      padding: '4px 12px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      backgroundColor: '#c0c0c0',
                      border: '2px solid',
                      borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                      color: '#000080',
                      fontWeight: 'bold',
                      outline: 'none',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.borderColor = '#808080 #dfdfdf #dfdfdf #808080'
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.borderColor = '#dfdfdf #808080 #808080 #dfdfdf'
                    }}
                  >
                    Reset Controls
                  </button>
                </div>
              </div>

              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{ display: 'none' }}
                onLoadedMetadata={() => {
                  console.log('Video metadata loaded')
                  if (isWebcamActive) {
                    drawFrame()
                  }}
                }
              />

              <div className="button-group">
                <button
                  onClick={startWebcam}
                  disabled={isWebcamActive}
                  className="btn btn-primary"
                  style={{
                    outline: 'none',
                    color: isWebcamActive ? '#888888' : '#000080',
                    fontWeight: 'bold',
                    opacity: isWebcamActive ? 0.5 : 1,
                    cursor: isWebcamActive ? 'not-allowed' : 'pointer',
                    backgroundColor: isWebcamActive ? '#d0d0d0' : '#c0c0c0',
                    border: '2px solid',
                    borderColor: isWebcamActive ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf'
                  }}
                >
                  ▶ Start
                </button>
                <button
                  onClick={() => {
                    playClickSound()
                    if (countdownValue > 0) {
                      // Cancel countdown if active
                      if (countdownIntervalRef.current) {
                        clearInterval(countdownIntervalRef.current)
                        countdownIntervalRef.current = null
                      }
                      setCountdownValue(0)
                    } else {
                      // Stop webcam if no countdown
                      stopWebcam()
                    }
                  }}
                  disabled={!isWebcamActive && countdownValue === 0}
                  className="btn btn-secondary"
                  style={{
                    outline: 'none',
                    color: !isWebcamActive && countdownValue === 0 ? '#888888' : '#000080',
                    fontWeight: 'bold',
                    opacity: !isWebcamActive && countdownValue === 0 ? 0.5 : 1,
                    cursor: !isWebcamActive && countdownValue === 0 ? 'not-allowed' : 'pointer',
                    backgroundColor: !isWebcamActive && countdownValue === 0 ? '#d0d0d0' : '#c0c0c0',
                    border: '2px solid',
                    borderColor: !isWebcamActive && countdownValue === 0 ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf'
                  }}
                >
                  ■ Stop
                </button>
                <button
                  onClick={handleCaptureWithTimer}
                  disabled={!isWebcamActive || isCapturing}
                  className="btn btn-capture"
                  style={{
                    outline: 'none',
                    color: !isWebcamActive || isCapturing ? '#888888' : '#000080',
                    fontWeight: 'bold',
                    opacity: !isWebcamActive || isCapturing ? 0.5 : 1,
                    cursor: !isWebcamActive || isCapturing ? 'not-allowed' : 'pointer',
                    backgroundColor: !isWebcamActive || isCapturing ? '#d0d0d0' : '#c0c0c0',
                    border: '2px solid',
                    borderColor: !isWebcamActive || isCapturing ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf'
                  }}
                >
                  ● Capture
                </button>
                {/* Timer dropdown button */}
                <div style={{ position: 'relative', marginLeft: '4px' }}>
                  <button
                    onClick={() => {
                      playClickSound()
                      setShowTimerDropdown(!showTimerDropdown)
                    }}
                    disabled={!isWebcamActive}
                    className="btn btn-timer"
                    style={{
                      outline: 'none',
                      color: !isWebcamActive ? '#888888' : '#000080',
                      fontWeight: 'bold',
                      opacity: !isWebcamActive ? 0.5 : 1,
                      cursor: !isWebcamActive ? 'not-allowed' : 'pointer',
                      backgroundColor: !isWebcamActive ? '#d0d0d0' : '#c0c0c0',
                      border: '2px solid',
                      borderColor: !isWebcamActive ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
                      minWidth: '60px'
                    }}
                  >
                    ⏱ {timerOption === 'none' ? 'Timer' : timerOption}
                  </button>
                  
                  {/* Dropdown menu */}
                  {showTimerDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      backgroundColor: '#c0c0c0',
                      border: '2px solid',
                      borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                      minWidth: '70px',
                      marginTop: '2px',
                      zIndex: 2000
                    }}>
                      {['none', '3s', '5s', '10s'].map((option) => (
                        <div
                          key={option}
                          onClick={() => {
                            playClickSound()
                            setTimerOption(option)
                            setShowTimerDropdown(false)
                          }}
                          style={{
                            padding: '4px 8px',
                            cursor: 'pointer',
                            backgroundColor: timerOption === option ? '#000080' : '#c0c0c0',
                            color: timerOption === option ? '#ffff00' : '#000080',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            userSelect: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#000080'
                            e.target.style.color = '#ffff00'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = timerOption === option ? '#000080' : '#c0c0c0'
                            e.target.style.color = timerOption === option ? '#ffff00' : '#000080'
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    playClickSound()
                    setShowControls(!showControls)
                  }}
                  disabled={!showMichonneOverlay}
                  className="btn btn-primary"
                  style={{ 
                    outline: 'none', 
                    color: !showMichonneOverlay ? '#888888' : '#000080', 
                    fontWeight: 'bold',
                    opacity: !showMichonneOverlay ? 0.5 : 1,
                    cursor: !showMichonneOverlay ? 'not-allowed' : 'pointer',
                    backgroundColor: !showMichonneOverlay ? '#d0d0d0' : '#c0c0c0'
                  }}
                >
                  ⊙ {showControls ? 'Hide' : 'Show'} Controls
                </button>
              </div>
            </div>

            <div className="statusbar">
              <div className="left">Michonne's Kiss Cam</div>
              <div className="right">&nbsp;</div>
            </div>
          </div>
        </animated.div>
      )}

      {/* Controls Window - Separate Window */}
      {showControls && (
        <div className="main-container secondary window" style={{
          position: 'fixed',
          top: `${controlsWindowPos.y}px`,
          left: `${controlsWindowPos.x}px`,
          zIndex: 1002
        }}>
          <div 
            className="title"
            onMouseDown={(e) => handleMouseDown(e, 'controlsWindow', controlsWindowPos)}
            style={{ 
              cursor: dragState?.window === 'controlsWindow' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'controlsWindow' ? '2px solid #ffffff' : 'none'
            }}
          >
            <h1>⚙️ Controls</h1>
            <button 
              onClick={() => {
                playClickSound()
                setShowControls(false)
              }}
              style={{
                marginLeft: 'auto',
                padding: '2px 6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                outline: 'none',
                backgroundColor: '#d85c5c'
              }}
            >
              ✕
            </button>
          </div>



          <div className="container-inner controls-container">
            {!isWebcamActive && (
              <>
                <p>Welcome to Michonne's Kiss Cam!</p>
                <p>Click "Start" to open the web cam and try out filters, and then capture!</p>
              </>
            )}

            {isWebcamActive && (
              <>
                <h3>Michonne Position & Size</h3>

                <div className="control-group">
                  <label>
                    Move horizontally: <span className="value">{offsetX}</span>
                  </label>
                  <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: '#666', top: '50%' }}></div>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      value={offsetX}
                      onChange={(e) => setOffsetX(Number(e.target.value))}
                      className="slider"
                      style={{ position: 'relative', zIndex: 1, width: '100%' }}
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label>
                    Move vertically: <span className="value">{offsetY}</span>
                  </label>
                  <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: '#666', top: '50%' }}></div>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      value={offsetY}
                      onChange={(e) => setOffsetY(Number(e.target.value))}
                      className="slider"
                      style={{ position: 'relative', zIndex: 1, width: '100%' }}
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label>
                    Scale: <span className="value">{scale.toFixed(2)}x</span>
                  </label>
                  <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: '#666', top: '50%' }}></div>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="slider"
                      style={{ position: 'relative', zIndex: 1, width: '100%' }}
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label>
                    Rotate: <span className="value">{rotation}°</span>
                  </label>
                  <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: '#666', top: '50%' }}></div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={rotation}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="slider"
                      style={{ position: 'relative', zIndex: 1, width: '100%' }}
                    />
                  </div>
                </div>

                <p className="tips">💡 Adjust the controls to change Michonne's position to your liking, then capture!</p>
              </>
            )}
          </div>

          <div className="statusbar">
            <div className="left">^_^</div>
            {isWebcamActive && (
              <button
                onClick={() => {
                  playClickSound()
                  setOffsetX(-27)
                  setOffsetY(-84)
                  setScale(0.7)
                  setRotation(0)
                }}
                style={{
                  marginLeft: 'auto',
                  padding: '2px 12px',
                  backgroundColor: '#c0c0c0',
                  color: 'black',
                  border: '1px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '10px',
                  fontFamily: 'Arial, sans-serif',
                  flex: 1,
                  maxWidth: '150px',
                  outline: 'none'
                }}
              >
                Reset Position
              </button>
            )}
          </div>
        </div>
      )}

      {/* Piercing Controls Modal */}
      {showPiercingControls && (
        <div className="main-container secondary window" style={{
          position: 'fixed',
          top: `${piercingControlsPos.y}px`,
          left: `${piercingControlsPos.x}px`,
          zIndex: 1003,
          maxWidth: '300px'
        }}>
          <div 
            className="title"
            onMouseDown={(e) => handleMouseDown(e, 'piercingControlsWindow', piercingControlsPos, (pos) => setPiercingControlsPos(pos))}
            style={{ 
              cursor: dragState?.window === 'piercingControlsWindow' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'piercingControlsWindow' ? '2px solid #ffffff' : 'none'
            }}
          >
            <h1>⚙️ {['None', 'Septum', 'Eyebrow', 'Labret', 'Lip', 'Spikes', 'Nose', 'Bridge', 'Eyes'][piercingPage]} Controls</h1>
            <button 
              onClick={() => {
                playClickSound()
                setShowPiercingControls(false)
              }}
              style={{
                marginLeft: 'auto',
                padding: '2px 6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                outline: 'none',
                backgroundColor: '#d85c5c'
              }}
            >
              ✕
            </button>
          </div>

          <div className="container-inner controls-container">
            {piercingPage === 0 && <p>Select a piercing to adjust its position</p>}
            {piercingPage === 1 && ( // Septum
              <>
                <div className="control-group">
                  <label>Move Horizontally: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_septum_offsetX'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_septum_offsetX'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_septum_offsetX': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div className="control-group">
                  <label>Move Vertically: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_septum_offsetY'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_septum_offsetY'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_septum_offsetY': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div className="control-group">
                  <label>Scale: <span className="value" style={{ fontSize: '10px' }}>{((piercingAdjustments['piercing_septum_scale'] ?? 1) * 100).toFixed(0)}%</span></label>
                  <input type="range" min="0.3" max="3" step="0.1" value={piercingAdjustments['piercing_septum_scale'] ?? 1} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_septum_scale': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; updated['piercing_septum_default'] = { offsetX: updated['piercing_septum_offsetX'] ?? 0, offsetY: updated['piercing_septum_offsetY'] ?? 0, scale: updated['piercing_septum_scale'] ?? 1 }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Save As New Default</button>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; const defaultValues = updated['piercing_septum_default']; delete updated['piercing_septum_offsetX']; delete updated['piercing_septum_offsetY']; delete updated['piercing_septum_scale']; if (defaultValues) { updated['piercing_septum_offsetX'] = defaultValues.offsetX; updated['piercing_septum_offsetY'] = defaultValues.offsetY; updated['piercing_septum_scale'] = defaultValues.scale; } localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Reset to Default</button>
                </div>
              </>
            )}
            {piercingPage === 2 && ( // Eyebrow
              <>
                <div className="control-group">
                  <label>Move Horizontally: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_eyebrow_offsetX'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_eyebrow_offsetX'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_eyebrow_offsetX': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div className="control-group">
                  <label>Move Vertically: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_eyebrow_offsetY'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_eyebrow_offsetY'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_eyebrow_offsetY': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div className="control-group">
                  <label>Scale: <span className="value" style={{ fontSize: '10px' }}>{((piercingAdjustments['piercing_eyebrow_scale'] ?? 1) * 100).toFixed(0)}%</span></label>
                  <input type="range" min="0.3" max="3" step="0.1" value={piercingAdjustments['piercing_eyebrow_scale'] ?? 1} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_eyebrow_scale': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; updated['piercing_eyebrow_default'] = { offsetX: updated['piercing_eyebrow_offsetX'] ?? 0, offsetY: updated['piercing_eyebrow_offsetY'] ?? 0, scale: updated['piercing_eyebrow_scale'] ?? 1 }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Save As New Default</button>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; const defaultValues = updated['piercing_eyebrow_default']; delete updated['piercing_eyebrow_offsetX']; delete updated['piercing_eyebrow_offsetY']; delete updated['piercing_eyebrow_scale']; if (defaultValues) { updated['piercing_eyebrow_offsetX'] = defaultValues.offsetX; updated['piercing_eyebrow_offsetY'] = defaultValues.offsetY; updated['piercing_eyebrow_scale'] = defaultValues.scale; } localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Reset to Default</button>
                </div>
              </>
            )}
            {piercingPage === 7 && ( // Bridge - with LEFT and RIGHT controls
              <>
                <p style={{ fontSize: '9px', marginBottom: '8px', color: '#666' }}>Left Bridge</p>
                <div className="control-group">
                  <label>Move Horizontally: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_bridgeLeft_offsetX'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_bridgeLeft_offsetX'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_bridgeLeft_offsetX': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '2px' }} />
                </div>
                <div className="control-group">
                  <label>Move Vertically: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_bridgeLeft_offsetY'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_bridgeLeft_offsetY'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_bridgeLeft_offsetY': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '2px' }} />
                </div>
                <p style={{ fontSize: '9px', marginBottom: '8px', marginTop: '12px', color: '#666' }}>Right Bridge</p>
                <div className="control-group">
                  <label>Move Horizontally: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_bridgeRight_offsetX'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_bridgeRight_offsetX'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_bridgeRight_offsetX': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '2px' }} />
                </div>
                <div className="control-group">
                  <label>Move Vertically: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_bridgeRight_offsetY'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_bridgeRight_offsetY'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_bridgeRight_offsetY': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '2px' }} />
                </div>
                <div className="control-group">
                  <label>Scale Both: <span className="value" style={{ fontSize: '10px' }}>{((piercingAdjustments['piercing_bridgeLeft_scale'] ?? 1) * 100).toFixed(0)}%</span></label>
                  <input type="range" min="0.3" max="3" step="0.1" value={piercingAdjustments['piercing_bridgeLeft_scale'] ?? 1} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_bridgeLeft_scale': val, 'piercing_bridgeRight_scale': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '2px' }} />
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; updated['piercing_bridgeLeft_default'] = { offsetX: updated['piercing_bridgeLeft_offsetX'] ?? 0, offsetY: updated['piercing_bridgeLeft_offsetY'] ?? 0, scale: updated['piercing_bridgeLeft_scale'] ?? 1 }; updated['piercing_bridgeRight_default'] = { offsetX: updated['piercing_bridgeRight_offsetX'] ?? 0, offsetY: updated['piercing_bridgeRight_offsetY'] ?? 0, scale: updated['piercing_bridgeRight_scale'] ?? 1 }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Save As New Default</button>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; ['bridgeLeft', 'bridgeRight'].forEach(p => { const defaultValues = updated[`piercing_${p}_default`]; delete updated[`piercing_${p}_offsetX`]; delete updated[`piercing_${p}_offsetY`]; delete updated[`piercing_${p}_scale`]; if (defaultValues) { updated[`piercing_${p}_offsetX`] = defaultValues.offsetX; updated[`piercing_${p}_offsetY`] = defaultValues.offsetY; updated[`piercing_${p}_scale`] = defaultValues.scale; } }); localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Reset to Default</button>
                </div>
              </>
            )}
            {piercingPage === 3 && ( // Labret
              <>
                <div className="control-group">
                  <label>Move Horizontally: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_labret_offsetX'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_labret_offsetX'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_labret_offsetX': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div className="control-group">
                  <label>Move Vertically: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_labret_offsetY'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_labret_offsetY'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_labret_offsetY': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div className="control-group">
                  <label>Scale: <span className="value" style={{ fontSize: '10px' }}>{((piercingAdjustments['piercing_labret_scale'] ?? 1) * 100).toFixed(0)}%</span></label>
                  <input type="range" min="0.3" max="3" step="0.1" value={piercingAdjustments['piercing_labret_scale'] ?? 1} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_labret_scale': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; updated['piercing_labret_default'] = { offsetX: updated['piercing_labret_offsetX'] ?? 0, offsetY: updated['piercing_labret_offsetY'] ?? 0, scale: updated['piercing_labret_scale'] ?? 1 }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Save As New Default</button>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; const defaultValues = updated['piercing_labret_default']; delete updated['piercing_labret_offsetX']; delete updated['piercing_labret_offsetY']; delete updated['piercing_labret_scale']; if (defaultValues) { updated['piercing_labret_offsetX'] = defaultValues.offsetX; updated['piercing_labret_offsetY'] = defaultValues.offsetY; updated['piercing_labret_scale'] = defaultValues.scale; } localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Reset to Default</button>
                </div>
              </>
            )}
            {piercingPage === 4 && ( // Lip
              <>
                <div className="control-group">
                  <label>Move Horizontally: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_lip_offsetX'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_lip_offsetX'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_lip_offsetX': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div className="control-group">
                  <label>Move Vertically: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_lip_offsetY'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_lip_offsetY'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_lip_offsetY': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div className="control-group">
                  <label>Scale: <span className="value" style={{ fontSize: '10px' }}>{((piercingAdjustments['piercing_lip_scale'] ?? 1) * 100).toFixed(0)}%</span></label>
                  <input type="range" min="0.3" max="3" step="0.1" value={piercingAdjustments['piercing_lip_scale'] ?? 1} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_lip_scale': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; updated['piercing_lip_default'] = { offsetX: updated['piercing_lip_offsetX'] ?? 0, offsetY: updated['piercing_lip_offsetY'] ?? 0, scale: updated['piercing_lip_scale'] ?? 1 }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Save As New Default</button>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; const defaultValues = updated['piercing_lip_default']; delete updated['piercing_lip_offsetX']; delete updated['piercing_lip_offsetY']; delete updated['piercing_lip_scale']; if (defaultValues) { updated['piercing_lip_offsetX'] = defaultValues.offsetX; updated['piercing_lip_offsetY'] = defaultValues.offsetY; updated['piercing_lip_scale'] = defaultValues.scale; } localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Reset to Default</button>
                </div>
              </>
            )}
            {piercingPage === 5 && ( // Spikes
              <>
                <p style={{ fontSize: '9px', marginBottom: '8px', color: '#666' }}>Left Spike</p>
                <div className="control-group">
                  <label>Move Horizontally: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_spikeLeft_offsetX'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_spikeLeft_offsetX'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_spikeLeft_offsetX': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '2px' }} />
                </div>
                <div className="control-group">
                  <label>Move Vertically: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_spikeLeft_offsetY'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_spikeLeft_offsetY'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_spikeLeft_offsetY': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '2px' }} />
                </div>
                <div className="control-group">
                  <label>Rotate: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_spikeLeft_rotate'] ?? 0}°</span></label>
                  <input type="range" min="-180" max="180" value={piercingAdjustments['piercing_spikeLeft_rotate'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_spikeLeft_rotate': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '2px' }} />
                </div>
                <p style={{ fontSize: '9px', marginBottom: '8px', marginTop: '12px', color: '#666' }}>Right Spike</p>
                <div className="control-group">
                  <label>Move Horizontally: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_spikeRight_offsetX'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_spikeRight_offsetX'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_spikeRight_offsetX': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '2px' }} />
                </div>
                <div className="control-group">
                  <label>Move Vertically: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_spikeRight_offsetY'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_spikeRight_offsetY'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_spikeRight_offsetY': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '2px' }} />
                </div>
                <div className="control-group">
                  <label>Rotate: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_spikeRight_rotate'] ?? 0}°</span></label>
                  <input type="range" min="-180" max="180" value={piercingAdjustments['piercing_spikeRight_rotate'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_spikeRight_rotate': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '2px' }} />
                </div>
                <div className="control-group">
                  <label>Scale Both: <span className="value" style={{ fontSize: '10px' }}>{((piercingAdjustments['piercing_spikeLeft_scale'] ?? 1) * 100).toFixed(0)}%</span></label>
                  <input type="range" min="0.3" max="3" step="0.1" value={piercingAdjustments['piercing_spikeLeft_scale'] ?? 1} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_spikeLeft_scale': val, 'piercing_spikeRight_scale': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '2px' }} />
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; updated['piercing_spikeLeft_default'] = { offsetX: updated['piercing_spikeLeft_offsetX'] ?? 0, offsetY: updated['piercing_spikeLeft_offsetY'] ?? 0, scale: updated['piercing_spikeLeft_scale'] ?? 1, rotate: updated['piercing_spikeLeft_rotate'] ?? 0 }; updated['piercing_spikeRight_default'] = { offsetX: updated['piercing_spikeRight_offsetX'] ?? 0, offsetY: updated['piercing_spikeRight_offsetY'] ?? 0, scale: updated['piercing_spikeRight_scale'] ?? 1, rotate: updated['piercing_spikeRight_rotate'] ?? 0 }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Save As New Default</button>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; ['spikeLeft', 'spikeRight'].forEach(p => { const defaultValues = updated[`piercing_${p}_default`]; delete updated[`piercing_${p}_offsetX`]; delete updated[`piercing_${p}_offsetY`]; delete updated[`piercing_${p}_scale`]; delete updated[`piercing_${p}_rotate`]; if (defaultValues) { updated[`piercing_${p}_offsetX`] = defaultValues.offsetX; updated[`piercing_${p}_offsetY`] = defaultValues.offsetY; updated[`piercing_${p}_scale`] = defaultValues.scale; updated[`piercing_${p}_rotate`] = defaultValues.rotate ?? 0; } }); localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Reset to Default</button>
                </div>
              </>
            )}
            {piercingPage === 6 && ( // Nose
              <>
                <div className="control-group">
                  <label>Move Horizontally: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_noseStud_offsetX'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_noseStud_offsetX'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_noseStud_offsetX': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div className="control-group">
                  <label>Move Vertically: <span className="value" style={{ fontSize: '10px' }}>{piercingAdjustments['piercing_noseStud_offsetY'] ?? 0}</span></label>
                  <input type="range" min="-50" max="50" value={piercingAdjustments['piercing_noseStud_offsetY'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_noseStud_offsetY': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div className="control-group">
                  <label>Scale: <span className="value" style={{ fontSize: '10px' }}>{((piercingAdjustments['piercing_noseStud_scale'] ?? 1) * 100).toFixed(0)}%</span></label>
                  <input type="range" min="0.3" max="3" step="0.1" value={piercingAdjustments['piercing_noseStud_scale'] ?? 1} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_noseStud_scale': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; updated['piercing_noseStud_default'] = { offsetX: updated['piercing_noseStud_offsetX'] ?? 0, offsetY: updated['piercing_noseStud_offsetY'] ?? 0, scale: updated['piercing_noseStud_scale'] ?? 1 }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Save As New Default</button>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; const defaultValues = updated['piercing_noseStud_default']; delete updated['piercing_noseStud_offsetX']; delete updated['piercing_noseStud_offsetY']; delete updated['piercing_noseStud_scale']; if (defaultValues) { updated['piercing_noseStud_offsetX'] = defaultValues.offsetX; updated['piercing_noseStud_offsetY'] = defaultValues.offsetY; updated['piercing_noseStud_scale'] = defaultValues.scale; } localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Reset to Default</button>
                </div>
              </>
            )}
            {piercingPage === 8 && ( // Eye Gem
              <>
                <div className="control-group">
                  <label>Move Horizontally: <span className="value" style={{ fontSize: '9px' }}>{piercingAdjustments['piercing_eyeGem_offsetX'] ?? 0}</span></label>
                  <input type="range" min="-20" max="20" value={piercingAdjustments['piercing_eyeGem_offsetX'] ?? 0} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_eyeGem_offsetX': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '2px' }} />
                </div>
                <div className="control-group">
                  <label>Move Vertically: <span className="value" style={{ fontSize: '9px' }}>{piercingAdjustments['piercing_eyeGem_offsetY'] ?? -20}</span></label>
                  <input type="range" min="-50" max="20" value={piercingAdjustments['piercing_eyeGem_offsetY'] ?? -20} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_eyeGem_offsetY': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '2px' }} />
                </div>
                <div className="control-group">
                  <label>Scale: <span className="value" style={{ fontSize: '9px' }}>{((piercingAdjustments['piercing_eyeGem_scale'] ?? 1.9) * 100).toFixed(0)}%</span></label>
                  <input type="range" min="0.3" max="3" step="0.1" value={piercingAdjustments['piercing_eyeGem_scale'] ?? 1.9} onChange={(e) => { const val = Number(e.target.value); setPiercingAdjustments(prev => { const updated = { ...prev, 'piercing_eyeGem_scale': val }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} className="slider" style={{ width: '100%', marginTop: '2px' }} />
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; updated['piercing_eyeGem_default'] = { offsetX: updated['piercing_eyeGem_offsetX'] ?? 0, offsetY: updated['piercing_eyeGem_offsetY'] ?? 0, scale: updated['piercing_eyeGem_scale'] ?? 1 }; localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Save As New Default</button>
                  <button onClick={() => { playClickSound(); setPiercingAdjustments(prev => { const updated = { ...prev }; const defaultValues = updated['piercing_eyeGem_default']; delete updated['piercing_eyeGem_offsetX']; delete updated['piercing_eyeGem_offsetY']; delete updated['piercing_eyeGem_scale']; if (defaultValues) { updated['piercing_eyeGem_offsetX'] = defaultValues.offsetX; updated['piercing_eyeGem_offsetY'] = defaultValues.offsetY; updated['piercing_eyeGem_scale'] = defaultValues.scale; } localStorage.setItem('piercingAdjustments', JSON.stringify(updated)); return updated }); }} style={{ padding: '4px 8px', backgroundColor: '#c0c0c0', color: '#000080', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', flex: 1, outline: 'none' }}>Reset to Default</button>
                </div>
              </>
            )}
          </div>

          <div className="statusbar">
            <div className="left">✦</div>
          </div>
        </div>
      )}

      {/* Downloads Folder Window */}
      {showDownloadsFolder && (
        <div id="downloads-window" style={{
          position: 'fixed',
          top: `${downloadsPos.y}px`,
          left: `${downloadsPos.x}px`,
          backgroundColor: '#c0c0c0',
          border: '2px solid',
          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
          boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
          width: '600px',
          maxHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001
        }}>
          {/* Title bar */}
          <div 
            style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: '#ffff00',
              padding: '2px 2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              cursor: dragState?.window === 'downloads' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'downloads' ? '2px solid #ffffff' : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'downloads', downloadsPos)}
          >
            <h1 style={{ margin: '2px 4px', fontSize: '14px', fontWeight: 'bold' }}>Downloads ⋆｡°✩</h1>
            {capturedImages.length > 1 && (
              <button 
                onClick={() => {
                  playClickSound()
                  setShowSaveAllModal(true)
                }}
                style={{
                  marginLeft: 'auto',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  outline: 'none',
                  backgroundColor: '#c0c0c0',
                  border: '2px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  fontSize: '11px',
                  color: '#000080'
                }}
              >
                💾 Save All
              </button>
            )}
            <button 
              onClick={handleCloseDownloads}
              style={{
                marginLeft: '8px',
                padding: '2px 6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                outline: 'none',
                backgroundColor: '#d85c5c'
              }}
            >
              ✕
            </button>
          </div>

          {/* File list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px',
            display: 'flex',
            flexWrap: 'nowrap',
            alignContent: 'flex-start',
            gap: '5px'
          }}>
            {(() => {
              // Calculate items that fit horizontally
              const downloadWindowWidth = 600
              const containerPadding = 8 // 4px on each side
              const itemGap = 5
              const availableWidth = downloadWindowWidth - containerPadding
              const itemsPerRow = Math.max(1, Math.floor(availableWidth / 80))
              const totalGapWidth = (itemsPerRow - 1) * itemGap
              const itemWidth = (availableWidth - totalGapWidth) / itemsPerRow
              
              const startIdx = downloadsPage * itemsPerRow
              const endIdx = startIdx + itemsPerRow
              const pageImages = capturedImages.slice(startIdx, endIdx)
              
              return pageImages.map((image) => (
                <div
                  key={image.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px',
                    width: `${itemWidth}px`,
                    flex: '0 1 auto',
                    textAlign: 'center',
                    borderRadius: '2px',
                    transition: 'background 0.1s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#000080'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'black'
                  }}
                >
                  <div
                    onMouseDown={(e) => {
                      if (e.button === 0) {
                        setDraggedImageId(image.id)
                        setDragImageSource('downloads')
                        setDragImagePos({ x: e.clientX - 30, y: e.clientY - 30 })
                      }
                    }}
                    onClick={() => {
                      playClickSound()
                      setSelectedImage(image)
                    }}
                    style={{
                      cursor: 'grab',
                      position: 'relative',
                      userSelect: 'none'
                    }}
                  >
                    <img 
                      src={image.dataUrl} 
                      alt={`Capture ${image.id}`}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        border: '1px solid #808080'
                      }}
                    />
                  </div>
                  <div style={{
                    fontSize: '7.5px',
                    fontFamily: 'Arial, sans-serif',
                    wordBreak: 'break-all'
                  }}>
                    {image.name || `kiss_${image.id}`}
                  </div>
                </div>
              ))
            })()}
          </div>

          {/* Pagination controls */}
          <div style={{
            display: 'flex',
            height: '24px',
            borderTop: '1px solid #dfdfdf',
            backgroundColor: '#c0c0c0',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '4px',
            paddingRight: '4px',
            gap: '4px'
          }}>
            <button
              onClick={() => {
                playClickSound()
                setDownloadsPage(Math.max(0, downloadsPage - 1))
              }}
              disabled={downloadsPage === 0}
              style={{
                padding: '2px 6px',
                cursor: downloadsPage === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                backgroundColor: downloadsPage === 0 ? '#a0a0a0' : '#c0c0c0',
                border: '2px solid',
                borderColor: downloadsPage === 0 ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
                fontSize: '12px'
              }}
            >
              ◄ Prev
            </button>
            <span style={{
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}>
              {(() => {
                const downloadWindowWidth = 600
                const itemWidth = 80
                const containerPadding = 8
                const availableWidth = downloadWindowWidth - containerPadding
                const itemsPerRow = Math.max(1, Math.floor(availableWidth / itemWidth))
                const maxPages = Math.ceil(capturedImages.length / itemsPerRow)
                return capturedImages.length === 0 ? 'No images' : `Page ${downloadsPage + 1}/${maxPages}`
              })()}
            </span>
            <button
              onClick={() => {
                playClickSound()
                setDownloadsPage(downloadsPage + 1)
              }}
              disabled={(() => {
                const downloadWindowWidth = 600
                const itemWidth = 80
                const containerPadding = 8
                const availableWidth = downloadWindowWidth - containerPadding
                const itemsPerRow = Math.max(1, Math.floor(availableWidth / itemWidth))
                return (downloadsPage + 1) * itemsPerRow >= capturedImages.length
              })()}
              style={{
                padding: '2px 6px',
                cursor: (() => {
                  const downloadWindowWidth = 600
                  const itemWidth = 80
                  const containerPadding = 8
                  const availableWidth = downloadWindowWidth - containerPadding
                  const itemsPerRow = Math.max(1, Math.floor(availableWidth / itemWidth))
                  return (downloadsPage + 1) * itemsPerRow >= capturedImages.length ? 'not-allowed' : 'pointer'
                })(),
                fontWeight: 'bold',
                backgroundColor: (() => {
                  const downloadWindowWidth = 600
                  const itemWidth = 80
                  const containerPadding = 8
                  const availableWidth = downloadWindowWidth - containerPadding
                  const itemsPerRow = Math.max(1, Math.floor(availableWidth / itemWidth))
                  return (downloadsPage + 1) * itemsPerRow >= capturedImages.length ? '#a0a0a0' : '#c0c0c0'
                })(),
                border: '2px solid',
                borderColor: (() => {
                  const downloadWindowWidth = 600
                  const itemWidth = 80
                  const containerPadding = 8
                  const availableWidth = downloadWindowWidth - containerPadding
                  const itemsPerRow = Math.max(1, Math.floor(availableWidth / itemWidth))
                  return (downloadsPage + 1) * itemsPerRow >= capturedImages.length ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf'
                })(),
                fontSize: '12px'
              }}
            >
              Next ►
            </button>
          </div>
        </div>
      )}

      {/* Music Player Modal */}
      {showMusicPlayer && (
        <div style={{
          position: 'fixed',
          top: `${musicPlayerPos.y}px`,
          left: `${musicPlayerPos.x}px`,
          backgroundColor: '#c0c0c0',
          border: '2px solid',
          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
          boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
          width: '280px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000
        }}>
          {/* Title bar */}
          <div 
            style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: '#ffff00',
              padding: '2px 2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              cursor: dragState?.window === 'musicPlayer' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'musicPlayer' ? '2px solid #ffffff' : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'musicPlayer', musicPlayerPos)}
          >
            <h1 style={{ margin: '2px 4px', fontSize: '14px', fontWeight: 'bold' }}>Music Player ⋆⭒˚｡⋆</h1>
            <button 
              onClick={handleCloseMusicPlayer}
              style={{
                marginLeft: 'auto',
                padding: '2px 6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                outline: 'none',
                backgroundColor: '#d85c5c'
              }}
            >
              ✕
            </button>
          </div>

          {/* Player content */}
          <div style={{
            padding: '15px',
            textAlign: 'center'
          }}>
            {/* Album cover display */}
            <div style={{
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <img 
                src={MUSIC_COVERS[currentSongIndex]}
                alt={`Album ${currentSongIndex + 1}`}
                style={{
                  width: '120px',
                  height: '120px',
                  border: '3px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  cursor: 'pointer',
                  boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #404040'
                }}
                onClick={() => {
                  playClickSound()
                  setShowMusicPlayer(false)
                }}
              />
            </div>

            <div style={{
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: 'bold',
              color: '#000080',
              minHeight: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}>
              {PLAYLIST[currentSongIndex].title}
            </div>

            {/* Play/Pause and Navigation arrows */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginBottom: '8px',
              paddingRight: '28px'
            }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <button
                  onClick={handlePreviousSong}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '24px',
                    padding: '0',
                    outline: 'none',
                    color: '#000080'
                  }}
                >
                  ◀
                </button>
                <button
                  onClick={handlePlayPauseMusic}
                  style={{
                    width: '60px',
                    padding: '6px',
                    backgroundColor: '#c0c0c0',
                    color: 'black',
                    border: '1px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    fontFamily: 'Arial, sans-serif',
                    outline: 'none'
                  }}
                >
                  {isMusciPlaying ? 'PAUSE' : 'PLAY'}
                </button>
                <button
                  onClick={handleNextSong}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '24px',
                    padding: '0',
                    outline: 'none',
                    color: '#000080'
                  }}
                >
                  ▶
                </button>
              </div>
              <button
                onClick={() => {
                  playClickSound()
                  setReplayCurrentSong(!replayCurrentSong)
                }}
                style={{
                  padding: '2px 4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: '2px outset #dfdfdf',
                  background: replayCurrentSong ? '#ffff00' : '#000080',
                  color: replayCurrentSong ? '#000080' : '#ffffff',
                  fontFamily: '"MS Sans Serif", Arial, sans-serif',
                  outline: 'none',
                  textAlign: 'center',
                  transition: 'all 0.1s',
                  lineHeight: '1'
                }}
                title="Replay current song"
              >
                ↻
              </button>
            </div>

            {/* Sound Waves Animation */}
            <div key={`waves-${currentSongIndex}`} style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '20px',
              gap: '3px',
              marginBottom: '5px'
            }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '1.5px',
                    height: isMusciPlaying ? '15px' : '4px',
                    backgroundColor: '#000080',
                    borderRadius: '1px',
                    animation: isMusciPlaying ? `wave 1.5s ease-in-out ${i * 0.3}s infinite` : 'none',
                    transition: 'height 0.3s ease'
                  }}
                />
              ))}
              <style>{`
                @keyframes wave {
                  0%, 100% { height: 4px; }
                  50% { height: 15px; }
                }
              `}</style>
            </div>

            {/* Seekable Audio Player */}
            <div style={{
              marginTop: '3px',
              marginBottom: '5px'
            }}>
              <input
                ref={musicSliderRef}
                type="range"
                min="0"
                max="100"
                value={isDraggingSlider ? sliderPosition : (bgMusicRef.current ? (bgMusicRef.current.currentTime / bgMusicRef.current.duration * 100) || 0 : 0)}
                onMouseDown={() => setIsDraggingSlider(true)}
                onMouseUp={() => setIsDraggingSlider(false)}
                onKeyDown={(e) => {
                  if (e.code === 'ArrowRight') {
                    e.preventDefault()
                    handleNextSong()
                  }
                  if (e.code === 'ArrowLeft') {
                    e.preventDefault()
                    handlePreviousSong()
                  }
                }}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value)
                  setSliderPosition(newValue)
                  if (bgMusicRef.current) {
                    bgMusicRef.current.currentTime = (newValue / 100) * bgMusicRef.current.duration
                  }
                }}
                style={{
                  width: '100%',
                  height: '6px',
                  cursor: 'pointer',
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  background: '#dfdfdf',
                  borderRadius: '3px',
                  outline: 'none'
                }}
              />
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 14px;
                  height: 14px;
                  background: #000080;
                  cursor: pointer;
                  border-radius: 2px;
                  border: 1px solid #dfdfdf;
                }
                input[type="range"]::-moz-range-thumb {
                  width: 14px;
                  height: 14px;
                  background: #000080;
                  cursor: pointer;
                  border-radius: 2px;
                  border: 1px solid #dfdfdf;
                }
              `}</style>
            </div>
          </div>

          {/* Status bar */}
          <div style={{
            display: 'flex',
            height: '20px',
            borderTop: '1px solid #dfdfdf',
            backgroundColor: '#c0c0c0',
            fontSize: '10px',
            alignItems: 'center',
            paddingLeft: '2px'
          }}>
            {(() => {
              const currentTime = isDraggingSlider 
                ? (sliderPosition / 100) * (audioDuration || 150)
                : audioCurrentTime
              const minutes = Math.floor(currentTime / 60)
              const seconds = Math.floor(currentTime % 60)
              const durationMinutes = Math.floor((audioDuration || 150) / 60)
              const durationSeconds = Math.floor((audioDuration || 150) % 60)
              return (
                <span>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} / {String(durationMinutes).padStart(2, '0')}:{String(durationSeconds).padStart(2, '0')}
                </span>
              )
            })()}
          </div>
        </div>
      )}

      {/* Trash Window */}
      {showTrash && (
        <div id="trash-window" style={{
          position: 'fixed',
          top: `${trashPos.y}px`,
          left: `${trashPos.x}px`,
          backgroundColor: '#c0c0c0',
          border: '2px solid',
          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
          boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
          width: '600px',
          maxHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000
        }}>
          {/* Title bar */}
          <div 
            style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: '#ffff00',
              padding: '2px 2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              cursor: dragState?.window === 'trash' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'trash' ? '2px solid #ffffff' : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'trash', trashPos)}
          >
            <h1 style={{ margin: '2px 4px', fontSize: '14px', fontWeight: 'bold' }}>Trash ⋆｡°✩</h1>
            <div style={{ display: 'flex', gap: '4px', marginRight: '2px' }}>
              {trashedImages.length > 0 && (
                <button 
                  onClick={() => setConfirmClearTrash(true)}
                  style={{
                    padding: '2px 6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    backgroundColor: '#c0c0c0',
                    border: '2px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    fontSize: '12px'
                  }}
                >
                  Clear Trash
                </button>
              )}
              <button 
                onClick={handleCloseTrash}
                style={{
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  outline: 'none',
                  backgroundColor: '#d85c5c'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* File list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px',
            display: 'flex',
            flexWrap: 'nowrap',
            alignContent: 'flex-start',
            gap: '5px'
          }}>
            {trashedImages.length === 0 ? (
              <div style={{
                width: '100%',
                textAlign: 'center',
                padding: '40px 20px',
                color: '#666',
                fontSize: '14px'
              }}>
                Trash is empty
              </div>
            ) : (
              (() => {
                // Calculate items that fit horizontally
                const trashWindowWidth = 600
                const containerPadding = 8 // 4px on each side
                const itemGap = 5
                const availableWidth = trashWindowWidth - containerPadding
                const itemsPerRow = Math.max(1, Math.floor(availableWidth / 80))
                const totalGapWidth = (itemsPerRow - 1) * itemGap
                const itemWidth = (availableWidth - totalGapWidth) / itemsPerRow
                
                const startIdx = trashPage * itemsPerRow
                const endIdx = startIdx + itemsPerRow
                const pageImages = trashedImages.slice(startIdx, endIdx)
                
                return pageImages.map((image) => (
                  <div
                    key={image.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px',
                      width: `${itemWidth}px`,
                      flex: '0 1 auto',
                      textAlign: 'center',
                      borderRadius: '2px',
                      transition: 'background 0.1s',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#000080'
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'black'
                    }}
                  >
                    <div
                      onMouseDown={(e) => {
                        if (e.button === 0) {
                          setDraggedImageId(image.id)
                          setDragImageSource('trash')
                          setDragImagePos({ x: e.clientX - 30, y: e.clientY - 30 })
                        }
                      }}
                      onClick={() => {
                        playClickSound()
                        setSelectedTrashImage(image)
                      }}
                      style={{
                        cursor: 'grab',
                        position: 'relative',
                        userSelect: 'none'
                      }}
                    >
                      <img 
                        src={image.dataUrl} 
                        alt={`Trash ${image.id}`}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          border: '1px solid #808080',
                          opacity: 0.7,
                          position: 'relative'
                        }}
                      />
                    </div>
                    <div style={{
                      fontSize: '7px',
                      fontFamily: 'Arial, sans-serif',
                      wordBreak: 'break-all'
                    }}>
                      {image.name || `trash_${image.id}`}
                    </div>
                  </div>
                ))
              })()
            )}
          </div>

          {/* Pagination controls */}
          <div style={{
            display: 'flex',
            height: '24px',
            borderTop: '1px solid #dfdfdf',
            backgroundColor: '#c0c0c0',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '4px',
            paddingRight: '4px',
            gap: '4px'
          }}>
            <button
              onClick={() => {
                playClickSound()
                setTrashPage(Math.max(0, trashPage - 1))
              }}
              disabled={trashPage === 0}
              style={{
                padding: '2px 6px',
                cursor: trashPage === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                backgroundColor: trashPage === 0 ? '#a0a0a0' : '#c0c0c0',
                border: '2px solid',
                borderColor: trashPage === 0 ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
                fontSize: '12px'
              }}
            >
              ◄ Prev
            </button>
            <span style={{
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}>
              {(() => {
                const trashWindowWidth = 600
                const itemWidth = 80
                const containerPadding = 8
                const availableWidth = trashWindowWidth - containerPadding
                const itemsPerRow = Math.max(1, Math.floor(availableWidth / itemWidth))
                const maxPages = Math.ceil(trashedImages.length / itemsPerRow)
                return trashedImages.length === 0 ? 'No images' : `Page ${trashPage + 1}/${maxPages}`
              })()}
            </span>
            <button
              onClick={() => {
                playClickSound()
                setTrashPage(trashPage + 1)
              }}
              disabled={(() => {
                const trashWindowWidth = 600
                const itemWidth = 80
                const containerPadding = 8
                const availableWidth = trashWindowWidth - containerPadding
                const itemsPerRow = Math.max(1, Math.floor(availableWidth / itemWidth))
                return (trashPage + 1) * itemsPerRow >= trashedImages.length
              })()}
              style={{
                padding: '2px 6px',
                cursor: (() => {
                  const trashWindowWidth = 600
                  const itemWidth = 80
                  const containerPadding = 8
                  const availableWidth = trashWindowWidth - containerPadding
                  const itemsPerRow = Math.max(1, Math.floor(availableWidth / itemWidth))
                  return (trashPage + 1) * itemsPerRow >= trashedImages.length ? 'not-allowed' : 'pointer'
                })(),
                fontWeight: 'bold',
                backgroundColor: (() => {
                  const trashWindowWidth = 600
                  const itemWidth = 80
                  const containerPadding = 8
                  const availableWidth = trashWindowWidth - containerPadding
                  const itemsPerRow = Math.max(1, Math.floor(availableWidth / itemWidth))
                  return (trashPage + 1) * itemsPerRow >= trashedImages.length ? '#a0a0a0' : '#c0c0c0'
                })(),
                border: '2px solid',
                borderColor: (() => {
                  const trashWindowWidth = 600
                  const itemWidth = 80
                  const containerPadding = 8
                  const availableWidth = trashWindowWidth - containerPadding
                  const itemsPerRow = Math.max(1, Math.floor(availableWidth / itemWidth))
                  return (trashPage + 1) * itemsPerRow >= trashedImages.length ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf'
                })(),
                fontSize: '12px'
              }}
            >
              Next ►
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {imageToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1002,
          cursor: 'auto'
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040',
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            cursor: 'auto'
          }}>
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: 'white',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none'
            }}>
              <h2 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>⚠️ Confirm Delete</h2>
            </div>

            {/* Content */}
            <div style={{
              padding: '20px',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                Are you sure you want to delete this photo?
              </p>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>
                This action cannot be undone.
              </p>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={confirmDeleteImage}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c00000',
                    color: 'white',
                    border: '1px solid #800000',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Yes, Delete
                </button>
                <button
                  onClick={cancelDeleteImage}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c0c0c0',
                    color: 'black',
                    border: '1px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      {imageToDeletePermanently && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1004,
          cursor: 'auto'
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040',
            display: 'flex',
            flexDirection: 'column',
            width: '320px',
            cursor: 'auto'
          }}>
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(to right, #c00000, #ff0000)',
              color: 'white',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none'
            }}>
              <h2 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>⚠️ Delete Forever?</h2>
            </div>

            {/* Content */}
            <div style={{
              padding: '20px',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                Permanently delete this photo from trash?
              </p>
              <p style={{ fontSize: '12px', color: '#c00000', marginBottom: '20px', fontWeight: 'bold' }}>
                This cannot be recovered!
              </p>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={confirmPermanentDeleteImage}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c00000',
                    color: 'white',
                    border: '1px solid #800000',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Delete Forever
                </button>
                <button
                  onClick={cancelPermanentDeleteImage}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c0c0c0',
                    color: 'black',
                    border: '1px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Keep
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Trash Confirmation Modal */}
      {confirmClearTrash && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1004,
          cursor: 'auto'
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            borderRadius: '4px',
            boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080, 1px 1px 0 #000000, -1px -1px 0 #dfdfdf',
            padding: '0',
            flexDirection: 'column',
            width: '350px',
            cursor: 'auto'
          }}>
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: 'white',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none'
            }}>
              <h2 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>⚠️ Clear All Trash</h2>
            </div>

            {/* Content */}
            <div style={{
              padding: '20px',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '15px', fontSize: '14px' }}>
                Are you sure you want to permanently delete ALL items in trash?
              </p>
              <p style={{ fontSize: '12px', color: '#c00000', marginBottom: '20px', fontWeight: 'bold' }}>
                ⚠️ This action cannot be undone. {trashedImages.length} item{trashedImages.length !== 1 ? 's' : ''} will be deleted forever.
              </p>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={clearAllTrash}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c00000',
                    color: 'white',
                    border: '1px solid #800000',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Yes, Delete All
                </button>
                <button
                  onClick={cancelClearTrash}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c0c0c0',
                    color: 'black',
                    border: '1px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1003,
          cursor: 'pointer'
        }} onClick={() => {
          playClickSound()
          setSelectedImage(null)
        }}>
          <div 
            ref={imageModalRef}
            style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040',
            maxWidth: '95%',
            maxHeight: '95%',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'auto',
            width: '800px'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: 'white',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none'
            }}>
              <h2 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>💋 {selectedImage.name || `Capture ${selectedImage.id}`}</h2>
              <button 
                onClick={() => {
                  playClickSound()
                  setSelectedImage(null)
                }}
                style={{
                  marginLeft: 'auto',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  outline: 'none',
                  backgroundColor: '#d85c5c'
                }}
              >
                ✕
              </button>
            </div>

            {/* Main content area */}
            <div style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden'
            }}>
              {/* Image viewer */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}>
                {/* Navigation arrows and image */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  gap: '20px',
                  padding: '10px',
                  position: 'relative'
                }}>
                  {(() => {
                    const currentIdx = capturedImages.findIndex(img => img.id === selectedImage.id)
                    const hasPrev = currentIdx > 0
                    
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          playClickSound()
                          if (hasPrev) setSelectedImage(capturedImages[currentIdx - 1])
                        }}
                        disabled={!hasPrev}
                        style={{
                          padding: '6px 10px',
                          cursor: hasPrev ? 'pointer' : 'not-allowed',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          color: hasPrev ? '#dfdfdf' : '#606060',
                          backgroundColor: hasPrev ? '#c0c0c0' : '#909090',
                          border: '2px solid',
                          borderColor: hasPrev ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                          position: 'absolute',
                          left: '5px',
                          opacity: hasPrev ? 1 : 0.5,
                          outline: 'none'
                        }}
                      >
                        ◄
                      </button>
                    )
                  })()}

                  <img 
                    src={selectedImage.dataUrl} 
                    alt="Full size capture"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />

                  {(() => {
                    const currentIdx = capturedImages.findIndex(img => img.id === selectedImage.id)
                    const hasNext = currentIdx < capturedImages.length - 1
                    
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          playClickSound()
                          if (hasNext) setSelectedImage(capturedImages[currentIdx + 1])
                        }}
                        disabled={!hasNext}
                        style={{
                          padding: '6px 10px',
                          cursor: hasNext ? 'pointer' : 'not-allowed',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          color: hasNext ? '#dfdfdf' : '#606060',
                          backgroundColor: hasNext ? '#c0c0c0' : '#909090',
                          border: '2px solid',
                          borderColor: hasNext ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                          position: 'absolute',
                          right: '5px',
                          opacity: hasNext ? 1 : 0.5,
                          outline: 'none'
                        }}
                      >
                        ►
                      </button>
                    )
                  })()}
                </div>

                {/* Bottom controls */}
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '6px 10px',
                  borderTop: '1px solid #dfdfdf',
                  backgroundColor: '#c0c0c0',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      playClickSound()
                      setShowSaveOptions(true)
                    }}
                    style={{
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      color: '#ffff00',
                      backgroundColor: '#1084d7',
                      border: '2px solid',
                      borderColor: '#1b9fff #0a4a99 #0a4a99 #1b9fff',
                      textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
                      minWidth: '100px',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      playClickSound()
                      moveImageToTrash(selectedImage.id)
                    }}
                    style={{
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      color: '#ffff00',
                      backgroundColor: '#c00000',
                      border: '2px solid',
                      borderColor: '#ff4444 #800000 #800000 #ff4444',
                      textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
                      minWidth: '100px',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* File info panel */}
              <div style={{
                width: '180px',
                borderLeft: '1px solid #dfdfdf',
                backgroundColor: '#c0c0c0',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                fontSize: '11px',
                fontFamily: 'MS Sans Serif, Arial, sans-serif',
                overflow: 'auto'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#000080' }}>File Properties</div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Name:</strong>
                  <div style={{ wordBreak: 'break-word', color: '#333' }}>{selectedImage.name || `kiss_${selectedImage.id}`}</div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Date:</strong>
                  <div style={{ color: '#333' }}>
                    {selectedImage.timestamp 
                      ? new Date(selectedImage.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })
                      : 'Unknown'}
                  </div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Type:</strong>
                  <div style={{ color: '#333' }}>PNG Image</div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Size:</strong>
                  <div style={{ color: '#333' }}>
                    {(() => {
                      const sizeBytes = selectedImage.dataUrl.length
                      const sizeKB = (sizeBytes / 1024).toFixed(1)
                      return `${sizeKB} KB`
                    })()}
                  </div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Index:</strong>
                  <div style={{ color: '#333' }}>
                    {capturedImages.findIndex(img => img.id === selectedImage.id) + 1} / {capturedImages.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trash Image Viewer Modal */}
      {selectedTrashImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1003,
          cursor: 'pointer'
        }} onClick={() => {
          playClickSound()
          setSelectedTrashImage(null)
        }}>
          <div style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040',
            maxWidth: '95%',
            maxHeight: '95%',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'auto',
            width: '800px'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: 'white',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none'
            }}>
              <h2 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>💋 {selectedTrashImage.name || `Capture ${selectedTrashImage.id}`}</h2>
              <button 
                onClick={() => {
                  playClickSound()
                  setSelectedTrashImage(null)
                }}
                style={{
                  marginLeft: 'auto',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  outline: 'none',
                  backgroundColor: '#d85c5c'
                }}
              >
                ✕
              </button>
            </div>

            {/* Main content area */}
            <div style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden'
            }}>
              {/* Image viewer */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}>
                {/* Navigation arrows and image */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  gap: '20px',
                  padding: '10px',
                  position: 'relative'
                }}>
                  {(() => {
                    const currentIdx = trashedImages.findIndex(img => img.id === selectedTrashImage.id)
                    const hasPrev = currentIdx > 0
                    
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          playClickSound()
                          if (hasPrev) setSelectedTrashImage(trashedImages[currentIdx - 1])
                        }}
                        disabled={!hasPrev}
                        style={{
                          padding: '6px 10px',
                          cursor: hasPrev ? 'pointer' : 'not-allowed',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          color: hasPrev ? '#dfdfdf' : '#606060',
                          backgroundColor: hasPrev ? '#c0c0c0' : '#909090',
                          border: '2px solid',
                          borderColor: hasPrev ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                          position: 'absolute',
                          left: '5px',
                          zIndex: 10,
                          opacity: hasPrev ? 1 : 0.5
                        }}
                      >
                        ◄
                      </button>
                    )
                  })()}

                  <img 
                    src={selectedTrashImage.dataUrl} 
                    alt="Full size trash capture"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />

                  {(() => {
                    const currentIdx = trashedImages.findIndex(img => img.id === selectedTrashImage.id)
                    const hasNext = currentIdx < trashedImages.length - 1
                    
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          playClickSound()
                          if (hasNext) setSelectedTrashImage(trashedImages[currentIdx + 1])
                        }}
                        disabled={!hasNext}
                        style={{
                          padding: '6px 10px',
                          cursor: hasNext ? 'pointer' : 'not-allowed',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          color: hasNext ? '#dfdfdf' : '#606060',
                          backgroundColor: hasNext ? '#c0c0c0' : '#909090',
                          border: '2px solid',
                          borderColor: hasNext ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                          position: 'absolute',
                          right: '5px',
                          opacity: hasNext ? 1 : 0.5
                        }}
                      >
                        ►
                      </button>
                    )
                  })()}
                </div>

                {/* Bottom controls */}
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '6px 10px',
                  borderTop: '1px solid #dfdfdf',
                  backgroundColor: '#c0c0c0',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      playClickSound()
                      restoreImageFromTrash(selectedTrashImage.id)
                    }}
                    style={{
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      color: '#ffff00',
                      backgroundColor: '#1084d7',
                      border: '2px solid',
                      borderColor: '#1b9fff #0a4a99 #0a4a99 #1b9fff',
                      textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
                      minWidth: '100px',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  >
                    Restore
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      playClickSound()
                      setImageToDeletePermanently(selectedTrashImage.id)
                    }}
                    style={{
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      color: '#ffff00',
                      backgroundColor: '#c00000',
                      border: '2px solid',
                      borderColor: '#ff4444 #800000 #800000 #ff4444',
                      textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
                      minWidth: '100px',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  >
                    Delete Forever
                  </button>
                </div>
              </div>

              {/* File info panel */}
              <div style={{
                width: '180px',
                borderLeft: '1px solid #dfdfdf',
                backgroundColor: '#c0c0c0',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                fontSize: '11px',
                fontFamily: 'MS Sans Serif, Arial, sans-serif',
                overflow: 'auto'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#000080' }}>File Properties</div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Name:</strong>
                  <div style={{ wordBreak: 'break-word', color: '#333' }}>{selectedTrashImage.name || `kiss_${selectedTrashImage.id}`}</div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Date:</strong>
                  <div style={{ color: '#333' }}>
                    {selectedTrashImage.timestamp 
                      ? new Date(selectedTrashImage.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })
                      : 'Unknown'}
                  </div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Type:</strong>
                  <div style={{ color: '#333' }}>PNG Image</div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Size:</strong>
                  <div style={{ color: '#333' }}>
                    {(() => {
                      const sizeBytes = selectedTrashImage.dataUrl.length
                      const sizeKB = (sizeBytes / 1024).toFixed(1)
                      return `${sizeKB} KB`
                    })()}
                  </div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Index:</strong>
                  <div style={{ color: '#333' }}>
                    {trashedImages.findIndex(img => img.id === selectedTrashImage.id) + 1} / {trashedImages.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purple Palace Window */}
      {showPurplePalace && (
        <div style={{
          position: 'fixed',
          top: `${purplePalacePos.y}px`,
          left: `${purplePalacePos.x}px`,
          backgroundColor: '#c0c0c0',
          border: '2px solid',
          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
          boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
          width: '300px',
          height: '250px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000
        }}>
          {/* Title bar */}
          <div 
            style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: '#ffff00',
              padding: '2px 2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              cursor: dragState?.window === 'purplePalace' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'purplePalace' ? '2px solid #ffffff' : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'purplePalace', purplePalacePos)}
          >
            <h1 style={{ margin: '2px 4px', fontSize: '14px', fontWeight: 'bold' }}>Purble Palace ⋆｡°✩</h1>
            <button 
              onClick={handleClosePurplePalace}
              style={{
                marginLeft: 'auto',
                padding: '2px 6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                outline: 'none',
                backgroundColor: '#d85c5c'
              }}
            >
              ✕
            </button>
          </div>

          {/* Video player */}
          <div style={{
            flex: 1,
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000'
          }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Tsddt5pGhZ4?autoplay=1"
              title="Purple Palace Build Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                border: 'none'
              }}
            />
          </div>

          {/* Status bar */}
          <div style={{
            display: 'flex',
            height: '20px',
            borderTop: '1px solid #dfdfdf',
            backgroundColor: '#c0c0c0',
            fontSize: '10px',
            alignItems: 'center',
            paddingLeft: '2px'
          }}>
            <span>🎮 Purple Palace - Build Video</span>
          </div>
        </div>
      )}

      {/* Save Options Modal */}
      {showSaveOptions && selectedImage && (
        <div
          onClick={() => setShowSaveOptions(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#c0c0c0',
              border: '2px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              boxShadow: '1px 1px 0px #dfdfdf, 2px 2px 0px #808080',
              width: '350px',
              fontFamily: 'MS Sans Serif, Arial, sans-serif',
              fontSize: '11px'
            }}
          >
            {/* Title Bar */}
            <div
              style={{
                background: 'linear-gradient(to right, #000080, #1084d7)',
                color: '#ffffff',
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                userSelect: 'none'
              }}
            >
              <span style={{ fontWeight: 'bold', fontSize: '11px' }}>Save As</span>
              <button
                onClick={() => {
                  playClickSound()
                  setShowSaveOptions(false)
                }}
                style={{
                  backgroundColor: '#d85c5c',
                  border: '1px solid',
                  borderColor: '#ffffff #000000 #000000 #ffffff',
                  width: '16px',
                  height: '14px',
                  padding: '0',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none',
                  color: '#ffffff'
                }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '20px' }}>
              <p style={{ margin: '0 0 20px 0', fontSize: '11px' }}>
                How would you like to save "{selectedImage.name || `kiss_${selectedImage.id}`}.png"?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Save Just Image */}
                <button
                  onClick={() => {
                    playClickSound()
                    setShowSaveOptions(false)
                    // Download original image
                    fetch(selectedImage.dataUrl)
                      .then(res => res.blob())
                      .then(blob => {
                        const url = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = `${selectedImage.name || `kiss_${selectedImage.id}`}.png`
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        URL.revokeObjectURL(url)
                      })
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#c0c0c0',
                    border: '2px solid',
                    borderColor: '#ffffff #808080 #808080 #ffffff',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    textAlign: 'left',
                    outline: 'none',
                    color: '#000080'
                  }}
                >
                  Save Just Image ⋆｡°✩
                </button>

                {/* Save with File Properties */}
                <button
                  onClick={async () => {
                    playClickSound()
                    setShowSaveOptions(false)
                    // Capture the image modal as screenshot
                    if (imageModalRef.current) {
                      const imageIndex = capturedImages.findIndex(img => img.id === selectedImage.id) + 1
                      const canvas = await html2canvas(imageModalRef.current, {
                        backgroundColor: null,
                        scale: 2,
                        useCORS: true,
                        allowTaint: true
                      })
                      canvas.toBlob(blob => {
                        const url = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = `michonne_kisses_${imageIndex}_window.png`
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        URL.revokeObjectURL(url)
                      })
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#c0c0c0',
                    border: '2px solid',
                    borderColor: '#ffffff #808080 #808080 #ffffff',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    textAlign: 'left',
                    outline: 'none',
                    color: '#000080'
                  }}
                >
                  Save Image with Microsoft window ⋆｡°✩
                </button>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    playClickSound()
                    setShowSaveOptions(false)
                  }}
                  style={{
                    padding: '4px 16px',
                    backgroundColor: '#c0c0c0',
                    border: '2px solid',
                    borderColor: '#ffffff #808080 #808080 #ffffff',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    outline: 'none',
                    minWidth: '75px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dragging image overlay */}
      {draggedImageId && dragImageSource && (
        <div
          style={{
            position: 'fixed',
            top: `${dragImagePos.y}px`,
            left: `${dragImagePos.x}px`,
            pointerEvents: 'none',
            zIndex: 9999
          }}
        >
          <img
            src={
              dragImageSource === 'downloads'
                ? capturedImages.find((img) => img.id === draggedImageId)?.dataUrl
                : trashedImages.find((img) => img.id === draggedImageId)?.dataUrl
            }
            alt="dragging"
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              border: '2px solid #000080',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
              borderRadius: '2px',
              opacity: 0.9
            }}
          />
        </div>
      )}

      {/* Bottom Left Profile Picture */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 100
        }}
      >
        <button
          onClick={() => {
            if (clickAudioRef.current) {
              clickAudioRef.current.currentTime = 0
              clickAudioRef.current.play().catch(err => console.log('Could not play click sound:', err))
            }
            setShowProfileMenu(!showProfileMenu)
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            borderRadius: '50%',
            overflow: 'hidden',
            width: '56px',
            height: '56px',
            outline: 'none'
          }}
        >
          <img
            src={profilePicture}
            alt="Profile"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid rgba(255, 255, 255, 0.6)'
            }}
          />
        </button>

        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <div
            style={{
              position: 'absolute',
              bottom: '64px',
              left: '0',
              backgroundColor: 'rgba(32, 32, 32, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              minWidth: '160px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              zIndex: 10000,
              backdropFilter: 'blur(10px)'
            }}
          >
            <button
              onClick={() => {
                if (clickAudioRef.current) {
                  clickAudioRef.current.currentTime = 0
                  clickAudioRef.current.play().catch(err => console.log('Could not play click sound:', err))
                }
                setShowProfileMenu(false)
                setIsLoggedIn(false)
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                cursor: 'pointer',
                textAlign: 'left',
                outline: 'none'
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Storage Limit Modal */}
      {showStorageLimitModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
            width: '450px',
            padding: '10px',
            fontFamily: 'MS Sans Serif, Arial, sans-serif',
            fontSize: '11px'
          }}>
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: '#ffff00',
              padding: '2px 4px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginLeft: '-10px',
              marginRight: '-10px',
              marginTop: '-10px',
              paddingLeft: '4px',
              paddingRight: '4px'
            }}>
              <div style={{ fontWeight: 'bold' }}>⚠️ Storage Capacity Reached</div>
              <button
                onClick={() => setShowStorageLimitModal(false)}
                style={{
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  backgroundColor: '#d85c5c',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff'
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{ marginBottom: '15px', lineHeight: '1.6' }}>
              <p>You have reached the 50 image local storage capacity.</p>
              <p>Please choose one of the following options:</p>
            </div>

            {/* Options: Delete All or Save as ZIP */}
            {!showDeleteConfirm && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => {
                    playClickSound()
                    setShowDeleteConfirm(true)
                  }}
                  disabled={isSavingZip}
                  style={{
                    padding: '10px',
                    cursor: isSavingZip ? 'not-allowed' : 'pointer',
                    backgroundColor: '#c0c0c0',
                    border: '2px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    opacity: isSavingZip ? 0.6 : 1,
                    textAlign: 'left',
                    paddingLeft: '12px',
                    color: '#000080'
                  }}
                >
                  🗑️ Delete All Downloads
                </button>
                <button
                  onClick={handleSaveAsZipThenDelete}
                  disabled={isSavingZip}
                  style={{
                    padding: '10px',
                    cursor: isSavingZip ? 'not-allowed' : 'pointer',
                    backgroundColor: '#c0c0c0',
                    border: '2px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    opacity: isSavingZip ? 0.6 : 1,
                    textAlign: 'left',
                    paddingLeft: '12px',
                    color: '#000080'
                  }}
                >
                  {isSavingZip ? '⏳ Creating ZIP...' : '💾 Save as ZIP then Delete'}
                </button>
              </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p>Are you sure you want to delete all images? This cannot be undone.</p>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    onClick={() => {
                      playClickSound()
                      setShowDeleteConfirm(false)
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      cursor: 'pointer',
                      backgroundColor: '#c0c0c0',
                      border: '2px solid',
                      borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                      fontWeight: 'bold',
                      fontSize: '11px',
                      color: '#000080'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAllImages}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      cursor: 'pointer',
                      backgroundColor: '#d85c5c',
                      border: '2px solid',
                      borderColor: '#ffffff #404040 #404040 #ffffff',
                      fontWeight: 'bold',
                      fontSize: '11px',
                      color: '#ffffff'
                    }}
                  >
                    Delete All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save All Modal */}
      {showSaveAllModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
            width: '400px',
            padding: '10px',
            fontFamily: 'MS Sans Serif, Arial, sans-serif',
            fontSize: '11px'
          }}>
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: '#ffff00',
              padding: '2px 4px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginLeft: '-10px',
              marginRight: '-10px',
              marginTop: '-10px',
              paddingLeft: '4px',
              paddingRight: '4px'
            }}>
              <div style={{ fontWeight: 'bold' }}>💾 Save All Images</div>
              <button
                onClick={() => setShowSaveAllModal(false)}
                style={{
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  backgroundColor: '#d85c5c',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff'
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{ marginBottom: '15px', lineHeight: '1.6' }}>
              <p>Save all images into a folder</p>
              <p style={{ fontSize: '10px', color: '#333' }}>Your images will be downloaded as a ZIP file containing all {capturedImages.length} image(s).</p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '5px' }}>
              <button
                onClick={() => {
                  playClickSound()
                  setShowSaveAllModal(false)
                }}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  cursor: 'pointer',
                  backgroundColor: '#c0c0c0',
                  border: '2px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  color: '#000080'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAllAsZip}
                disabled={isSavingZip || capturedImages.length === 0}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  cursor: isSavingZip || capturedImages.length === 0 ? 'not-allowed' : 'pointer',
                  backgroundColor: '#c0c0c0',
                  border: '2px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  color: '#000080',
                  opacity: isSavingZip || capturedImages.length === 0 ? 0.6 : 1
                }}
              >
                {isSavingZip ? '⏳ Creating ZIP...' : '💾 Download ZIP'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio elements */}
      <audio ref={clickAudioRef} src={clickSound} />
      <audio ref={windowsOpeningAudioRef} src={windowsOpeningSound} />
    </div>
  )
}

export default App
