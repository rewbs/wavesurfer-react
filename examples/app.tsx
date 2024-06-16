import { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type WaveSurfer from 'wavesurfer.js-rewbs'
import Minimap from 'wavesurfer.js-rewbs/dist/plugins/minimap.js';
import Timeline from 'wavesurfer.js-rewbs/dist/plugins/timeline.js';
import WavesurferPlayer from '../dist/index.js'


const audioUrls = ['./audio.wav', './stereo.mp3']

const randomColor = () =>
  `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`

const App = () => {
  const [urlIndex, setUrlIndex] = useState(0)
  const [waveColor, setWaveColor] = useState(randomColor)
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Swap the audio URL
  const onUrlChange = () => {
    setIsPlaying(false)
    setUrlIndex((index) => (index + 1) % audioUrls.length)
  }

  // Play/pause the audio
  const onPlayPause = () => {
    setIsPlaying((playing) => {
      if (wavesurfer?.isPlaying() !== !playing) {
        wavesurfer?.playPause()
        return !playing
      }
      return playing
    })
  }

  const plugins = useMemo(() => {
    return [Minimap.create({}), Timeline.create({})]
  }, []);

  // Randomize the wave color
  const onColorChange = () => {
    //setWaveColor(randomColor) // slow -- re-render
    wavesurfer?.setOptions({ waveColor: randomColor() }) // fast -- no re-render
  }

  return (
    <>
      <WavesurferPlayer
        height={100}
        waveColor={waveColor}
        url={audioUrls[urlIndex]}
        plugins={plugins}
        onReady={(ws : WaveSurfer) => setWavesurfer(ws)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div style={{ margin: '1em 0', display: 'flex', gap: '1em' }}>
        <button onClick={onUrlChange}>Change audio</button>

        <button onClick={onColorChange}>Randomize color</button>

        <button onClick={onPlayPause} style={{ minWidth: '5em' }}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </>
  )
}

// Create a React root and render the app
const root = createRoot(document.getElementById('app')!)
root.render(<App />)
