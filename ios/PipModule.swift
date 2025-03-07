import Foundation
import AVKit

@objc(PipModule)
class PipModule: NSObject {
    private var pipController: AVPictureInPictureController?
    private var playerLayer: AVPlayerLayer?
    private var player: AVPlayer?

    override init() {
        super.init()
        setupAudioSession()
    }

    private func setupAudioSession() {
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .moviePlayback)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("Failed to set up audio session: \(error)")
        }
    }

    @objc func EnterPipMode(_ videoUrl: String) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self,
                  let keyWindow = UIApplication.shared.windows.first,
                  let url = URL(string: videoUrl) else { return }
            
            // Create an AVPlayer instance if not already set
            self.player = AVPlayer(url: url)
            
            // Assign the player to a layer
            self.playerLayer = AVPlayerLayer(player: self.player)
            self.playerLayer?.frame = keyWindow.bounds
            keyWindow.layer.addSublayer(self.playerLayer!)

            // Initialize PiP Controller
            if AVPictureInPictureController.isPictureInPictureSupported() {
                self.pipController = AVPictureInPictureController(playerLayer: self.playerLayer!)
                self.pipController?.startPictureInPicture()
                self.player?.play()
            }
        }
    }
    
    // Clean up method
    @objc   func cleanup() {
        DispatchQueue.main.async { [weak self] in
            self?.pipController?.stopPictureInPicture()
            self?.player?.pause()
            self?.playerLayer?.removeFromSuperlayer()
            self?.player = nil
            self?.playerLayer = nil
            self?.pipController = nil
        }
    }
}