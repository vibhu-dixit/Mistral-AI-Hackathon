# Mistral AI Hackathon - Roadar

Turn every camera into an autonomous road inspector.

![Road Hazard](https://cdn.discordapp.com/attachments/1540763019510816870/1540831448586526821/ChatGPT_Image_Aug_22_2026_02_13_49_PM.png?ex=6a8b629c&is=6a8a111c&hm=3093a13c3ecda5c3274ab7804b061cb084008a7d3a586901d45cd0913dcfc323)

Image-only MVP: upload a street photo, Mistral detects the hazard, SF311
duplicate-check runs, and a municipal report is generated.

See [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md).

| Area | Folder | Owner | Scope |
|---|---|---|---|
| AI + Backend | [`ai-service/`](ai-service/) + [`backend/`](backend/) | Ibrahim | `POST /analyze-image`, `POST /api/observations`, Mistral vision/OCR/agent, SF311 |
| Frontend | [`web-app/`](web-app/) | Johnathon | Upload + review UI |
| Dashboard | [`dashboard/`](dashboard/) | Johnathon | Map, pins, filters |
| Research / data | [`docs/`](docs/) | Member 3 | Briefing + civic categories |

Video analysis is deferred.
