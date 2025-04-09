![Logo](public/aniteams-logo.png)

# AniTeams - Anime Streaming Website



Welcome to AniTeams verison 2 ! A modern anime streaming platform built with Next.js 15 and Tailwind CSS, featuring AniList integration, anime bookmarking, skip intro/outro functionality, and more.

## Features

- **AniList Integration**: Link your AniList account to view your saved anime .
- **Bookmarking**: Save your favorite episodes (bookmarking is currently local and not linked to AniList yet).
- **Skip Intro/Outro**: Skip anime intros and outros for a smoother experience.
- **ArtPlayer**: still use our trusty old player   [Click here to view the source code of the player](https://github.com/anime-kun32/aniteams-player).
  
## Repositories Used

   - [hianime-mapper](https://github.com/IrfanKhan66/hianime-mapper)- For episode data 
   - [aniwatch-api](https://github.com/ghoshRitesh12/aniwatch-api) - For streaming source 
   - [api.consumet.org](https://github.com/consumet/api.consumet.org) - For anime data 

## Installation Steps

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **Yarn** (Recommended) or **npm**

### 1. Clone the Repository

```bash
git clone https://github.com/anime-kun32/AniTeams.git
cd aniteams
```

### 2. Install Dependencies

Using Yarn:

```bash
yarn install
```

Using npm:

```bash
npm install
```
### 4. make sure you fill up the env . This is required 
```.env
NEXT_PUBLIC_API_BASE_URL=https://youraniwatch-api.com # https://github.com/ghoshRitesh12/aniwatch-api
NEXT_PUBLIC_CONSUMET_BASE_URL=https://your-consumet.com # your consumet api url base 
NEXT_PUBLIC_ANILIST_CLIENT_ID=your-anilist-client-id
NEXT_PUBLIC_DEPLOYMENT_URL=https://http://localhost:3000 # your prodoction url 

```



### 5. Run the Development Server

After setting up, run the development server using the following command:

Using Yarn:

```bash
yarn dev
```

Using npm:

```bash
npm run dev
```
app should now be running on `http://localhost:3000`.

## Coming soon !!
- [ ] sign up and registration
- [ ] PWA support 
- [ ] full anilist integration with anilist
- [ ] Bookmark
- [ ] resume watching
- [ ] And lots more !! Any more features mention in issues or make a pull request 


### issues and contribution 
As always any issues or contributions you want to make list them or make a pull request . 

#  Enjoy using the app and Welcome to AniTeams-v2 !!
