# Requirements — UrenPortaal

> Laatste update: 4 maart 2026  
> Status: ✅ Geïmplementeerd

---

## 1. Projectoverzicht

UrenPortaal is een volledig front-end urenregistratieportaal bedoeld als sollicitatieopdracht/demonstratieproject. De applicatie draait zonder backend; alle data wordt opgeslagen in **localStorage** en de actieve sessie wordt bijgehouden in een **cookie**.

---

## 2. Tech Stack

| Onderdeel        | Keuze                        | Reden                                                                 |
|------------------|------------------------------|-----------------------------------------------------------------------|
| Framework        | React 18 (CDN / UMD)         | Breed bekend, geen buildstap vereist voor CDN-gebruik                 |
| JSX transform    | Babel Standalone 7 (CDN)     | Verwerkt JSX in de browser, geen Node.js nodig                        |
| Styling          | Tailwind CSS Play CDN        | Utility-first, eenvoudig te configureren met merkkleuren              |
| Componenten      | Custom (geen component lib)  | Geen npm-pakket nodig; full control over design                       |
| Routing          | Custom hash router           | `HashRouter` werkt zonder webserver (ook via `file://`)               |
| Sessie           | `document.cookie`            | Conform opdracht: sessiedata in cookies                               |
| Persistentie     | `localStorage`               | ±5–10 MB beschikbaar; cookies te klein voor entry-data (max 4 KB)    |

> **Let op:** Babel Standalone toont een dev-only console-waarschuwing en is niet bedoeld voor productie. Voor een productieapplicatie zou een build-pipeline (Vite, CRA of Next.js) worden gebruikt.

---

## 3. Gebruikersrollen

| Rol        | Standaard account          | Wachtwoord     |
|------------|----------------------------|----------------|
| Admin      | `admin`                    | `Admin123!`    |
| Manager    | `manager`                  | `Manager123!`  |
| Gebruiker  | `user`                     | `User123!`     |

---

## 4. Functionele requirements

### 4.1 Authenticatie (alle rollen)
- [x] Inloggen met gebruikersnaam en wachtwoord
- [x] Foutmelding bij ongeldige combinatie
- [x] Sessie opgeslagen als cookie (1 dag geldig)
- [x] Uitloggen wist sessiecookie en navigeert naar login
- [x] Niet-ingelogde bezoekers worden doorgestuurd naar `/login`
- [x] Ingelogde bezoekers worden doorgestuurd van `/login` naar `/dashboard`

### 4.2 Urenregistratie (Gebruiker + Admin)
- [x] Nieuwe registratie aanmaken met de volgende verplichte velden:
  - **Datum**
  - **Projectnaam**
  - **Projectcode**
  - **Taakomschrijving**
  - **Aantal gewerkte uren** (stap 0,5; bereik 0,5 – 24)
- [x] Registratie opslaan als **concept** (bewaard, nog niet ingediend)
- [x] Registratie **indienen** (status → `ingediend`, voor de manager zichtbaar)
- [x] Concept bewerken en opnieuw indienen
- [x] Afgekeurde registratie bewerken en opnieuw indienen
- [x] Concept verwijderen (met bevestigingsvenster)
- [x] Gebruiker ziet uitsluitend zijn/haar eigen registraties
- [x] Overzichtstabel gesorteerd op datum (nieuwste eerst)
- [x] Afkeuringsreden zichtbaar bij afgekeurde registraties

### 4.3 Goedkeuring (Manager)
- [x] Overzicht van alle ingediende registraties (status `ingediend`)
- [x] Registratie **goedkeuren** (status → `goedgekeurd`)
- [x] Registratie **afkeuren** (status → `afgekeurd`) met optionele toelichting
- [x] Overzicht van eerder beoordeelde registraties (goedgekeurd / afgekeurd)
- [x] Medewerkersnaam en gebruikersnaam zichtbaar per registratie

### 4.4 Rapportage (Manager)
- [x] Rapportagepagina aanwezig met filteropties:
  - Periode (van – tot)
  - Medewerker
  - Project (naam of code)
  - Status
- [x] Knoppen `Rapport genereren`, `Exporteren als CSV`, `Exporteren als PDF` zichtbaar
- [⚠️] **Rapportagefunctie werkt (opzettelijk) niet** — knoppen tonen een foutmelding
- [x] Duidelijke waarschuwingsbanner dat de functie niet beschikbaar is

### 4.5 Gebruikersbeheer (Admin)
- [x] Overzicht van alle gebruikers (naam, gebruikersnaam, rol)
- [x] Nieuwe gebruiker aanmaken (naam, gebruikersnaam, wachtwoord, rol)
- [x] Validatie: gebruikersnaam uniek, wachtwoord minimaal 6 tekens
- [x] Gebruiker verwijderen (met bevestigingsvenster)
- [x] Admin kan eigen account niet verwijderen
- [x] Admin heeft ook toegang tot de pagina `Mijn uren`

### 4.6 Reset
- [x] Navigeren naar `/#/reset` herstelt de applicatie naar beginstatus:
  - localStorage gewist en opnieuw gezaaid met standaardgebruikers
  - Alle urenregistraties verwijderd
  - Sessiecookie verwijderd
  - Doorsturen naar `/login`

---

## 5. Niet-functionele requirements

### 5.1 Routing
- [x] Hash-gebaseerde routing (`/#/path`) — werkt zonder webserver (ook via `file://`)
- [x] Rolgebaseerde toegangscontrole per route

| Route        | Admin | Manager | Gebruiker |
|--------------|:-----:|:-------:|:---------:|
| `/dashboard` | ✅    | ✅      | ✅        |
| `/hours`     | ✅    | ❌      | ✅        |
| `/approval`  | ❌    | ✅      | ❌        |
| `/reports`   | ❌    | ✅      | ❌        |
| `/users`     | ✅    | ❌      | ❌        |

### 5.2 Merkidentiteit
- Primaire kleur:   `rgb(235, 180, 70)` → `#EBB446` (goud/geel)
- Secundaire kleur: `rgb(44, 81, 109)`  → `#2C516D` (donkerblauw)
- Sidebar: secundaire achtergrond, primaire kleur voor actief nav-item
- Knoppen: `primary` (goud), `secondary` (donkerblauw), `danger` (rood), `success` (groen)

### 5.3 Responsive
- [x] Zijbalk verbergt op mobiele schermen (≤ 1024 px)
- [x] Hamburger-menu toont zijbalk als overlay op mobiel
- [x] Formulieren en tabellen horizontaal scrollbaar op smalle viewports

### 5.4 UX / Feedback
- [x] Toast-notificaties bij acties (succesvol opslaan, indienen, goedkeuren, etc.)
- [x] Weergave van validatiefouten direct onder invoervelden
- [x] Bevestigingsvenster bij destructieve acties (verwijderen)
- [x] Afkeuringsreden zichtbaar als tooltip in de uren-tabel

---

## 6. Datamodel

### Gebruiker (`localStorage: uren_users`)
```json
{
  "id": "1",
  "username": "admin",
  "password": "Admin123!",
  "role": "admin",
  "name": "Administrator"
}
```

### Urenregistratie (`localStorage: uren_entries`)
```json
{
  "id": "1711234567890",
  "userId": "3",
  "datum": "2026-03-04",
  "projectnaam": "Portaalmigratie",
  "projectcode": "PRJ-2026-001",
  "taakomschrijving": "Frontend ontwikkeling urenregistratie",
  "uren": 8,
  "status": "goedgekeurd",
  "aangemaaktOp": "2026-03-04T09:00:00.000Z",
  "reviewedBy": "2",
  "reviewedOn": "2026-03-04T10:30:00.000Z",
  "reviewNote": ""
}
```

### Statusdiagram
```
[concept] ──indienen──▶ [ingediend] ──goedkeuren──▶ [goedgekeurd]
                                   └──afkeuren───▶ [afgekeurd] ──bewerken+indienen──▶ [ingediend]
```

### Sessiecookie (`uren_session`)
Bevat een JSON-object met de ingelogde gebruiker (zonder wachtwoord):
```json
{ "id": "1", "username": "admin", "role": "admin", "name": "Administrator" }
```

---

## 7. Bekende beperkingen / bewuste keuzes

| Item | Toelichting |
|---|---|
| Wachtwoorden plaintext | In plaintext in localStorage. Acceptabel voor een demo; productie vereist server-side hashing. |
| Geen persistentie over browsers | Data zit in localStorage van één browser/device. |
| Babel Standalone | Compile in de browser; ~800 KB extra payload, dev-only. Niet geschikt voor productie. |
| Rapportage niet-functioneel | Bewuste requirement: knoppen tonen een foutmelding. |
| Geen paginering | Tabellen tonen alle rijen; acceptabel voor demo-data. |
| Reset via URL | Bewust: `/#/reset` herstelt de applicatie direct zonder bevestiging. |

---

## 8. Serverloze deploymentinstructies

De applicatie bestaat uit één enkel bestand: **`index.html`**.

**Openen zonder server:**
```
Dubbelklik op index.html  →  opent in de standaardbrowser
```

**Lokale server (optioneel, voor HTTPS-cookies):**
```bash
# Python 3
python3 -m http.server 8080
# → http://localhost:8080
```

**Reset:**
Navigeer naar:  `http://localhost:8080/#/reset`  
of direct in de browser:  `file:///pad/naar/index.html#/reset`
