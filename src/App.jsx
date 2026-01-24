import { useEffect, useRef, useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import html2canvas from 'html2canvas'
import LoginPage from './LoginPage'

// App title constant
const APP_TITLE = "Edward's Windows Laptop"

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
import cursorImg from './assets/cursor.svg'
import emptyBinImg from './assets/empty_bin.webp'
import fullBinImg from './assets/Recycle_bin_full.webp'
import trashSound from './assets/trash.mp3'
import heartFilterImg from './assets/heart_filter.png'
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
  }
]
import './App.css'

// Music cover images array
const MUSIC_COVERS = [music1Cover, music2Cover, music3Cover, music4Cover, music5Cover, music6Cover]

function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayImageRef = useRef(null)
  const heartFilterRef = useRef(null)
  const bloodSplatterRef = useRef(null)
  const borderRef = useRef(null)
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

  // State for overlay positioning
  const [offsetX, setOffsetX] = useState(-27)
  const [offsetY, setOffsetY] = useState(-84)
  const [scale, setScale] = useState(0.7)
  const [rotation, setRotation] = useState(0)
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
  const [captureNotification, setCaptureNotification] = useState(null)
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
  const [replayCurrentSong, setReplayCurrentSong] = useState(false)
  const bgMusicRef = useRef(null)
  const imageModalRef = useRef(null)
  const [dragState, setDragState] = useState(null)
  const [draggedImageId, setDraggedImageId] = useState(null)
  const [dragImageSource, setDragImageSource] = useState(null)
  const [dragImagePos, setDragImagePos] = useState({ x: 0, y: 0 })
  const [kissCamPos, setKissCamPos] = useState({ x: 650, y: 10 })
const [downloadsPos, setDownloadsPos] = useState({ x: 50, y: 490 })
  const [musicPlayerPos, setMusicPlayerPos] = useState({ x: 1200, y: 500 })
  const [controlsWindowPos, setControlsWindowPos] = useState({ x: 310, y: 20 })
  const [trashPos, setTrashPos] = useState({ x: 250, y: 660 })
  const [purplePalacePos, setPurplePalacePos] = useState({ x: 880, y: 550 })
  const [captureNotificationPos, setCaptureNotificationPos] = useState({ x: 400, y: 200 })
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn')
    return saved ? JSON.parse(saved) : false
  })
  const [currentFilter, setCurrentFilter] = useState(() => {
    const saved = localStorage.getItem('currentFilter')
    return saved ? JSON.parse(saved) : 'normal'
  })
  const [useHeartFilter, setUseHeartFilter] = useState(() => {
    const saved = localStorage.getItem('useHeartFilter')
    return saved ? JSON.parse(saved) : false
  })
  const [use4Grid, setUse4Grid] = useState(() => {
    const saved = localStorage.getItem('use4Grid')
    return saved ? JSON.parse(saved) : false
  })
  const [useBloodSplatter, setUseBloodSplatter] = useState(() => {
    const saved = localStorage.getItem('useBloodSplatter')
    return saved ? JSON.parse(saved) : false
  })
  const [currentBorder, setCurrentBorder] = useState(() => {
    const saved = localStorage.getItem('currentBorder')
    return saved ? JSON.parse(saved) : 'none'
  })
  const [showMichonneOverlay, setShowMichonneOverlay] = useState(() => {
    const saved = localStorage.getItem('showMichonneOverlay')
    return saved ? JSON.parse(saved) : true
  })
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Fade in animation
  const fadeProps = useSpring({ opacity: 1, from: { opacity: 0 } })

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
    // Load window positions from localStorage
    const savedWindowPositions = localStorage.getItem('windowPositions')
    if (savedWindowPositions) {
      try {
        const positions = JSON.parse(savedWindowPositions)
        if (positions.kissCamPos) setKissCamPos(positions.kissCamPos)
        if (positions.downloadsPos) setDownloadsPos(positions.downloadsPos)
        if (positions.musicPlayerPos) setMusicPlayerPos(positions.musicPlayerPos)
        if (positions.controlsWindowPos) setControlsWindowPos(positions.controlsWindowPos)
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

  // Persist window positions to localStorage
  useEffect(() => {
    const windowPositions = {
      kissCamPos,
      downloadsPos,
      musicPlayerPos,
      controlsWindowPos,
      trashPos,
      purplePalacePos,
      captureNotificationPos,
    }
    localStorage.setItem('windowPositions', JSON.stringify(windowPositions))
  }, [kissCamPos, downloadsPos, musicPlayerPos, controlsWindowPos, trashPos, purplePalacePos, captureNotificationPos])

  // Persist 4-grid toggle to localStorage
  useEffect(() => {
    localStorage.setItem('use4Grid', JSON.stringify(use4Grid))
  }, [use4Grid])

  // Persist heart filter toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useHeartFilter', JSON.stringify(useHeartFilter))
  }, [useHeartFilter])

  // Persist blood splatter toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useBloodSplatter', JSON.stringify(useBloodSplatter))
  }, [useBloodSplatter])

  // Persist current border to localStorage
  useEffect(() => {
    localStorage.setItem('currentBorder', JSON.stringify(currentBorder))
  }, [currentBorder])

  // Persist michonne overlay toggle to localStorage
  useEffect(() => {
    localStorage.setItem('showMichonneOverlay', JSON.stringify(showMichonneOverlay))
  }, [showMichonneOverlay])

  // Keep imageCountRef in sync with imageCount state
  useEffect(() => {
    imageCountRef.current = imageCount
  }, [imageCount])

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
    const audioElement = bgMusicRef.current
    if (!audioElement) return

    const handlePlay = () => setIsMusicPlaying(true)
    const handlePause = () => setIsMusicPlaying(false)
    const handleTimeUpdate = () => setAudioCurrentTime(audioElement.currentTime)

    audioElement.addEventListener('play', handlePlay)
    audioElement.addEventListener('pause', handlePause)
    audioElement.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      audioElement.removeEventListener('play', handlePlay)
      audioElement.removeEventListener('pause', handlePause)
      audioElement.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [])

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

    // Preload all borders
    const borderMap = {
      film_frame: new URL('./assets/film_frame.png', import.meta.url).href,
      filter_border: new URL('./assets/filter_border.png', import.meta.url).href,
      katana_border: new URL('./assets/katana_border.png', import.meta.url).href
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

    // Add realistic film grain texture to all frames with frame-based animation
    frameCounterRef.current++
    addGrainTexture(canvas, ctx, 0.12, frameCounterRef.current)

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

    // Draw border overlay if one is selected (skip film_frame and katana_border in 4-grid mode as they'll be drawn later)
    if (currentBorder !== 'none' && borderRef.current) {
      const shouldSkipForGridMode = use4Grid && (currentBorder === 'film_frame' || currentBorder === 'katana_border')
      
      if (!shouldSkipForGridMode) {
        const borderImg = borderRef.current
        let borderScale = 1 // Full canvas size by default
        let borderOpacity = 1 // Default opacity
        
        // Make film_frame larger and reduce opacity
        if (currentBorder === 'film_frame') {
          borderScale = 1
          borderOpacity = 0.8 // Reduced opacity for film_frame
        }
        if (currentBorder === 'filter_border') {
          borderScale = 1.25
          borderOpacity = 1 // Reduced opacity for film_frame
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

    // If 4-grid mode: create a temporary canvas with the single frame, then tile it 4 times
    if (use4Grid) {
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

    // Draw film_frame or katana_border once across all 4 grids (if in 4-grid mode)
    if (use4Grid && (currentBorder === 'film_frame' || currentBorder === 'katana_border') && borderRef.current) {
      const borderImg = borderRef.current
      let borderOpacity = 1

      if (currentBorder === 'film_frame') {
        borderOpacity = 0.8
      }

      const borderWidth = canvas.width
      const borderHeight = canvas.height

      ctx.globalAlpha = borderOpacity
      ctx.drawImage(borderImg, 0, 0, borderWidth, borderHeight)
      ctx.globalAlpha = 1.0
    }

    // Draw blood splatter overlay if enabled (highest z-index)
    // Single overlay across entire screen (or all 4 grids if in 4-grid mode)
    if (useBloodSplatter && bloodSplatterRef.current) {
      try {
        const splatterImg = bloodSplatterRef.current
        const splatterScale = 1.2 // Scale to cover full screen
        const splatterWidth = canvas.width * splatterScale
        const splatterHeight = canvas.height * splatterScale
        const splatterX = (canvas.width - splatterWidth) / 2
        const splatterY = (canvas.height - splatterHeight) / 2

        ctx.globalAlpha = 0.5 // More visible opacity
        ctx.drawImage(splatterImg, splatterX, splatterY, splatterWidth, splatterHeight)
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
  }, [isWebcamActive, offsetX, offsetY, scale, rotation, currentFilter, use4Grid, useHeartFilter, useBloodSplatter, currentBorder, showMichonneOverlay])

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
    if (!canvasRef.current) {
      console.error('Canvas ref not available')
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
    setTimeout(() => setCaptureNotification(false), 2000)

    // Increment capture counter immediately
    captureCounterRef.current += 1
    localStorage.setItem('captureCounter', captureCounterRef.current.toString())

    // Compress image in background (non-blocking)
    try {
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

  // Handle window dragging
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
      cursor: `url(${cursorImg}) 4 12, auto`
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
            fontSize: '14px',
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
          ✓ Image Captured!
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
                <div className="canvas-container">
                  <canvas
                    ref={canvasRef}
                    className="webcam-canvas"
                    style={{ 
                      display: 'block',
                      backgroundColor: isWebcamActive ? 'transparent' : '#000000'
                    }}
                  />
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
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#000080'
                  }}>
                    Filters:
                  </div>
                  <button
                    onClick={() => {
                      playClickSound()
                      setCurrentFilter('normal')
                    }}
                    disabled={!isWebcamActive}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: currentFilter === 'normal' ? '#000080' : isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                      color: currentFilter === 'normal' ? 'white' : isWebcamActive ? 'black' : '#606060',
                      border: '1px solid',
                      borderColor: currentFilter === 'normal' ? '#000080' : isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                      cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      outline: 'none',
                      opacity: isWebcamActive ? 1 : 0.5
                    }}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => {
                      playClickSound()
                      setCurrentFilter('blackAndWhite')
                    }}
                    disabled={!isWebcamActive}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: currentFilter === 'blackAndWhite' ? '#000080' : isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                      color: currentFilter === 'blackAndWhite' ? 'white' : isWebcamActive ? 'black' : '#606060',
                      border: '1px solid',
                      borderColor: currentFilter === 'blackAndWhite' ? '#000080' : isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                      cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      outline: 'none',
                      opacity: isWebcamActive ? 1 : 0.5
                    }}
                  >
                    B&W
                  </button>

                  {/* Heart Filter Toggle Checkbox */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid #808080'
                  }}>
                    <input
                      type="checkbox"
                      id="heartToggle"
                      checked={useHeartFilter}
                      onChange={(e) => {
                        playClickSound()
                        setUseHeartFilter(e.target.checked)
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
                      htmlFor="heartToggle"
                      style={{
                        fontSize: '11px',
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        userSelect: 'none',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    >
                      Hearts ♥
                    </label>
                  </div>

                  {/* 4 Grid Toggle Checkbox */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px'
                  }}>
                    <input
                      type="checkbox"
                      id="fourGridToggle"
                      checked={use4Grid}
                      onChange={(e) => {
                        playClickSound()
                        setUse4Grid(e.target.checked)
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
                      htmlFor="fourGridToggle"
                      style={{
                        fontSize: '11px',
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        userSelect: 'none',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    >
                      4 Grid View
                    </label>
                  </div>

                  {/* Blood Splatter Toggle */}
                  <div style={{ marginTop: '10px' }}>
                    <input
                      type="checkbox"
                      id="bloodSplatterToggle"
                      checked={useBloodSplatter}
                      onChange={(e) => {
                        setUseBloodSplatter(e.target.checked)
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
                      htmlFor="bloodSplatterToggle"
                      style={{
                        fontSize: '11px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        marginLeft: '5px'
                      }}
                    >
                      Blood 
                    </label>
                  </div>

                  {/* Border Selection */}
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '11px', marginBottom: '5px', opacity: isWebcamActive ? 1 : 0.5 }}>Borders:</div>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <button
                        onClick={() => {
                          const options = ['none', 'film_frame', 'filter_border', 'katana_border']
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
                         currentBorder === 'filter_border' ? 'Waifus' : 'Katana'}
                      </span>
                      <button
                        onClick={() => {
                          const options = ['none', 'film_frame', 'filter_border', 'katana_border']
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
                      Michonne Overlay
                    </label>
                  </div>
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
                  onClick={stopWebcam}
                  disabled={!isWebcamActive}
                  className="btn btn-secondary"
                  style={{
                    outline: 'none',
                    color: !isWebcamActive ? '#888888' : '#000080',
                    fontWeight: 'bold',
                    opacity: !isWebcamActive ? 0.5 : 1,
                    cursor: !isWebcamActive ? 'not-allowed' : 'pointer',
                    backgroundColor: !isWebcamActive ? '#d0d0d0' : '#c0c0c0',
                    border: '2px solid',
                    borderColor: !isWebcamActive ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf'
                  }}
                >
                  ■ Stop
                </button>
                <button
                  onClick={capturePhoto}
                  disabled={!isWebcamActive}
                  className="btn btn-capture"
                  style={{
                    outline: 'none',
                    color: !isWebcamActive ? '#888888' : '#000080',
                    fontWeight: 'bold',
                    opacity: !isWebcamActive ? 0.5 : 1,
                    cursor: !isWebcamActive ? 'not-allowed' : 'pointer',
                    backgroundColor: !isWebcamActive ? '#d0d0d0' : '#c0c0c0',
                    border: '2px solid',
                    borderColor: !isWebcamActive ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf'
                  }}
                >
                  ● Capture
                </button>
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
                    Offset X: <span className="value">{offsetX}</span>
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
                    Offset Y: <span className="value">{offsetY}</span>
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
                    Rotation: <span className="value">{rotation}°</span>
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
            <button 
              onClick={handleCloseDownloads}
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

          {/* File list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px',
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            gap: '10px'
          }}>
            {(() => {
              const itemsPerPage = 5
              const startIdx = downloadsPage * itemsPerPage
              const endIdx = startIdx + itemsPerPage
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
                    minWidth: '70px',
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
                    fontSize: '10px',
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
              {capturedImages.length === 0 ? 'No images' : `Page ${downloadsPage + 1}/${Math.ceil(capturedImages.length / 5)}`}
            </span>
            <button
              onClick={() => {
                playClickSound()
                setDownloadsPage(downloadsPage + 1)
              }}
              disabled={(downloadsPage + 1) * 5 >= capturedImages.length}
              style={{
                padding: '2px 6px',
                cursor: (downloadsPage + 1) * 5 >= capturedImages.length ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                backgroundColor: (downloadsPage + 1) * 5 >= capturedImages.length ? '#a0a0a0' : '#c0c0c0',
                border: '2px solid',
                borderColor: (downloadsPage + 1) * 5 >= capturedImages.length ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
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
              marginBottom: '15px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <img 
                src={MUSIC_COVERS[currentSongIndex]}
                alt={`Album ${currentSongIndex + 1}`}
                style={{
                  width: '80px',
                  height: '80px',
                  border: '2px solid #000080',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  playClickSound()
                  setShowMusicPlayer(false)
                }}
              />
            </div>

            {/* Play/Pause and Navigation arrows */}
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '15px'
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
                  padding: '8px',
                  backgroundColor: '#c0c0c0',
                  color: 'black',
                  border: '1px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '11px',
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

            <div style={{
              marginBottom: '15px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#000080',
              minHeight: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              {PLAYLIST[currentSongIndex].title}
              <button
                onClick={() => {
                  playClickSound()
                  setReplayCurrentSong(!replayCurrentSong)
                }}
                style={{
                  padding: '2px 4px',
                  fontSize: '14px',
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
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '30px',
              gap: '3px'
            }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '3px',
                    height: isMusciPlaying ? '20px' : '5px',
                    backgroundColor: '#000080',
                    borderRadius: '1px',
                    animation: isMusciPlaying ? `wave 0.6s ease-in-out ${i * 0.1}s infinite` : 'none',
                    transition: 'height 0.3s ease'
                  }}
                />
              ))}
              <style>{`
                @keyframes wave {
                  0%, 100% { height: 5px; }
                  50% { height: 20px; }
                }
              `}</style>
            </div>

            {/* Seekable Audio Player */}
            <div style={{
              marginTop: '5px',
              marginBottom: '10px'
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
                ? (sliderPosition / 100) * (bgMusicRef.current?.duration || 150)
                : audioCurrentTime
              const minutes = Math.floor(currentTime / 60)
              const seconds = Math.floor(currentTime % 60)
              const durationMinutes = Math.floor((bgMusicRef.current?.duration || 150) / 60)
              const durationSeconds = Math.floor((bgMusicRef.current?.duration || 150) % 60)
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
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            gap: '10px'
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
                const itemsPerPage = 5
                const startIdx = trashPage * itemsPerPage
                const endIdx = startIdx + itemsPerPage
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
                      minWidth: '70px',
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
                      fontSize: '10px',
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
              {trashedImages.length === 0 ? 'No images' : `Page ${trashPage + 1}/${Math.ceil(trashedImages.length / 5)}`}
            </span>
            <button
              onClick={() => {
                playClickSound()
                setTrashPage(trashPage + 1)
              }}
              disabled={(trashPage + 1) * 5 >= trashedImages.length}
              style={{
                padding: '2px 6px',
                cursor: (trashPage + 1) * 5 >= trashedImages.length ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                backgroundColor: (trashPage + 1) * 5 >= trashedImages.length ? '#a0a0a0' : '#c0c0c0',
                border: '2px solid',
                borderColor: (trashPage + 1) * 5 >= trashedImages.length ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
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
                      textAlign: 'center'
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
                      textAlign: 'center'
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
                  <div style={{ color: '#333' }}>{selectedImage.timestamp || 'Unknown'}</div>
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
                      objectFit: 'contain',
                      opacity: 0.8
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
                      textAlign: 'center'
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
                      textAlign: 'center'
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
                  <div style={{ color: '#333' }}>{selectedTrashImage.timestamp || 'Unknown'}</div>
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
                  background: 'linear-gradient(to bottom, #dfdfdf, #808080)',
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
                  outline: 'none'
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

      {/* Audio elements */}
      <audio ref={clickAudioRef} src={clickSound} />
      <audio ref={windowsOpeningAudioRef} src={windowsOpeningSound} />
    </div>
  )
}

export default App
