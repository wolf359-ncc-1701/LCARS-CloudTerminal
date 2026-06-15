# Roadmap

## V0 - Visual Prototype

Scope:

- Vite + React + TypeScript app.
- Static/mock data only.
- LCARS shell layout.
- Bridge dashboard.
- Home, Energy, Memory, Command modes.
- Auto Mode skeleton.
- Settings and Info overlays.
- Red alert state.
- Synthesized UI sounds with mute.

Done when:

- App runs locally.
- Desktop and mobile screenshots pass visual review.
- No external services are required.

## V1 - Local App Backbone

Scope:

- FastAPI backend.
- WebSocket status channel.
- SQLite database.
- Device simulator.
- Persisted settings.

Done when:

- Frontend receives live mock telemetry from backend.
- Commands produce logged simulated actions.

## V2 - Real Home Integration

Scope:

- Mosquitto MQTT.
- Home Assistant proxy.
- Sensor ingestion.
- Real device control behind explicit safety mapping.

Done when:

- A real or test Home Assistant entity can be controlled.
- Device events appear in the LCARS event log.

## V3 - Voice And AI

Scope:

- Browser audio capture.
- ASR service: Whisper/Vosk or API-backed.
- TTS: browser first, Piper later.
- Rule-based command parser.
- Optional LLM-assisted intent mapping.

Done when:

- A spoken command can trigger a safe mapped action.
- The command log shows transcript, intent, action, and result.

## V4 - Deployment And Multi-Device

Scope:

- Docker Compose.
- Caddy or Nginx.
- PWA support.
- Remote access via Tailscale or Cloudflare Tunnel.
- Backup strategy.
- User/device permissions.

Done when:

- The system can run on a home mini PC.
- Multiple browser clients can connect.

