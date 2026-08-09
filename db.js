/**
 * FrameInGoa - Local Database Engine (LocalStorage + Reactive State)
 */

class Database {
  constructor() {
    this.STORAGE_KEY = "frameingoa_db_v2";
    this.init();
  }

  init() {
    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      this.seedDefaults();
    }
  }

  getStore() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || { cards: [], users: [] };
    } catch (e) {
      console.error("Error reading database store:", e);
      return { cards: [], users: [] };
    }
  }

  saveStore(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  seedDefaults() {
    const defaultData = {
      users: [],
      cards: [],
      teams: [],
      activityLogs: []
    };
    this.saveStore(defaultData);
  }
          college: "IIT Bombay",
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
          techStack: ["solidity", "react", "node"],
          builderClass: "Web3 Builder",
          badge: "💎 Web3 Hacker",
          frameId: "frame2",
          frameName: "Cyberpunk Neon ⚡",
          bio: "Decentralized protocols & Smart Contracts.",
          likesCount: 9,
          downloadsCount: 15,
          sharesCount: 11,
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
        },
        {
          id: "card_3",
          userId: "u_aman",
          userName: "Aman Verma",
          username: "aman",
          college: "NIT Calicut",
          photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
          techStack: ["flutter", "figma", "firebase"],
          builderClass: "Mobile Builder",
          badge: "📱 Mobile Engineer",
          frameId: "frame3",
          frameName: "Golden VIP Minimal ✨",
          bio: "Cross-platform mobile apps & UI design.",
          likesCount: 7,
          downloadsCount: 12,
          sharesCount: 8,
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
        }
      ],
      frames: APP_CONFIG.defaultFrames,
      teams: [
        {
          id: "team_goa_cyber",
          name: "Goa Cyber Squad",
          code: "GOA2026",
          ownerId: "u_atharv",
          ownerName: "Atharv",
          members: [
            { userId: "u_atharv", name: "Atharv", role: "Leader", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80", builderClass: "AI Builder" },
            { userId: "u_rahul", name: "Rahul", role: "Dev", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80", builderClass: "Web3 Builder" },
            { userId: "u_aman", name: "Aman", role: "Designer", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80", builderClass: "Mobile Builder" }
          ],
          createdAt: new Date().toISOString()
        }
      ],
      likes: [
        { cardId: "card_1", userId: "u_rahul" },
        { cardId: "card_1", userId: "u_aman" }
      ],
      downloads: [
        { cardId: "card_1", count: 29 }
      ],
      shares: [
        { cardId: "card_1", platform: "twitter", count: 18 }
      ],
      activityLogs: [
        { id: "act_1", message: "Atharv created Builder Card: AI Builder", timestamp: new Date().toISOString() },
        { id: "act_2", message: "Rahul Sharma joined Goa Cyber Squad", timestamp: new Date().toISOString() },
        { id: "act_3", message: "Aman Verma downloaded Card #3", timestamp: new Date().toISOString() }
      ]
    };

    this.saveStore(defaultData);
  }

  // --- Users Operations ---
  getUsers() {
    return this.getStore().users || [];
  }

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  }

  getUserByUsername(username) {
    if (!username) return null;
    return this.getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  getUserByEmail(email) {
    if (!email) return null;
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user) {
    const store = this.getStore();
    const newUser = {
      id: "u_" + Date.now(),
      username: user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase(),
      points: 0,
      role: "user",
      createdAt: new Date().toISOString(),
      ...user
    };
    store.users.push(newUser);
    this.saveStore(store);
    this.logActivity(`${newUser.name} registered a new account.`);
    return newUser;
  }

  updateUserPoints(userId, pointsToAdd, reason) {
    const store = this.getStore();
    const user = store.users.find(u => u.id === userId);
    if (user) {
      user.points = (user.points || 0) + pointsToAdd;
      this.saveStore(store);
      if (reason) {
        this.logActivity(`${user.name} earned +${pointsToAdd} pts (${reason})`);
      }
    }
  }

  // --- Cards Operations ---
  getCards() {
    return this.getStore().cards || [];
  }

  getCardById(id) {
    return this.getCards().find(c => c.id === id);
  }

  getUserCards(userId) {
    return this.getCards().filter(c => c.userId === userId);
  }

  saveCard(cardData) {
    const store = this.getStore();
    const newCard = {
      id: "card_" + Date.now(),
      likesCount: 0,
      downloadsCount: 0,
      sharesCount: 0,
      createdAt: new Date().toISOString(),
      ...cardData
    };
    store.cards.unshift(newCard);
    this.saveStore(store);
    
    // Add points to user
    if (newCard.userId) {
      this.updateUserPoints(newCard.userId, APP_CONFIG.scoring.generateCard, "Created Builder Card");
    }

    this.logActivity(`${newCard.userName} generated a new Builder Card (${newCard.builderClass})`);
    return newCard;
  }

  likeCard(cardId, userId) {
    const store = this.getStore();
    const card = store.cards.find(c => c.id === cardId);
    if (!card) return false;

    const existingLikeIndex = store.likes.findIndex(l => l.cardId === cardId && l.userId === userId);
    if (existingLikeIndex > -1) {
      // Unlike
      store.likes.splice(existingLikeIndex, 1);
      card.likesCount = Math.max(0, (card.likesCount || 1) - 1);
    } else {
      // Like
      store.likes.push({ cardId, userId, timestamp: new Date().toISOString() });
      card.likesCount = (card.likesCount || 0) + 1;

      // Award points to card owner
      if (card.userId) {
        this.updateUserPoints(card.userId, APP_CONFIG.scoring.receiveLike, "Received Card Like");
      }
    }

    this.saveStore(store);
    return card.likesCount;
  }

  incrementDownload(cardId) {
    const store = this.getStore();
    const card = store.cards.find(c => c.id === cardId);
    if (card) {
      card.downloadsCount = (card.downloadsCount || 0) + 1;
      this.saveStore(store);
    }
  }

  incrementShare(cardId, platform = "X") {
    const store = this.getStore();
    const card = store.cards.find(c => c.id === cardId);
    if (card) {
      card.sharesCount = (card.sharesCount || 0) + 1;
      this.saveStore(store);
      
      // Award points to user for sharing
      if (card.userId) {
        this.updateUserPoints(card.userId, APP_CONFIG.scoring.shareX, `Shared on ${platform}`);
      }
    }
  }

  // --- Frames Operations ---
  getFrames() {
    return this.getStore().frames || [];
  }

  getActiveFrames() {
    return this.getFrames().filter(f => f.isActive);
  }

  addFrame(frame) {
    const store = this.getStore();
    const newFrame = {
      id: "frame_" + Date.now(),
      isActive: true,
      isPremium: false,
      ...frame
    };
    store.frames.push(newFrame);
    this.saveStore(store);
    this.logActivity(`Admin uploaded new Frame: ${newFrame.name}`);
    return newFrame;
  }

  toggleFrameActive(frameId) {
    const store = this.getStore();
    const frame = store.frames.find(f => f.id === frameId);
    if (frame) {
      frame.isActive = !frame.isActive;
      this.saveStore(store);
    }
  }

  // --- Teams Operations ---
  getTeams() {
    return this.getStore().teams || [];
  }

  getTeamById(id) {
    return this.getTeams().find(t => t.id === id);
  }

  createTeam(teamName, ownerUser) {
    const store = this.getStore();
    const newTeam = {
      id: "team_" + Date.now(),
      name: teamName,
      code: "GOA" + Math.floor(1000 + Math.random() * 9000),
      ownerId: ownerUser.id,
      ownerName: ownerUser.name,
      members: [
        {
          userId: ownerUser.id,
          name: ownerUser.name,
          role: "Leader",
          photo: ownerUser.photo,
          builderClass: ownerUser.builderClass || "Builder"
        }
      ],
      createdAt: new Date().toISOString()
    };

    store.teams.push(newTeam);
    this.saveStore(store);
    this.updateUserPoints(ownerUser.id, APP_CONFIG.scoring.createTeam, "Created Team Squad");
    this.logActivity(`${ownerUser.name} created new team: ${teamName}`);
    return newTeam;
  }

  addTeamMember(teamId, memberData) {
    const store = this.getStore();
    const team = store.teams.find(t => t.id === teamId);
    if (!team) return false;

    if (team.members.length >= 5) {
      throw new Error("Team has reached maximum 5 members limit!");
    }

    const exists = team.members.some(m => m.userId === memberData.userId);
    if (!exists) {
      team.members.push(memberData);
      this.saveStore(store);
      this.logActivity(`${memberData.name} joined team ${team.name}`);
    }
    return team;
  }

  // --- Leaderboard ---
  getLeaderboard() {
    const users = this.getUsers();
    const cards = this.getCards();

    return users.map(user => {
      const userCards = cards.filter(c => c.userId === user.id);
      const totalLikes = userCards.reduce((acc, c) => acc + (c.likesCount || 0), 0);
      const totalDownloads = userCards.reduce((acc, c) => acc + (c.downloadsCount || 0), 0);
      const totalShares = userCards.reduce((acc, c) => acc + (c.sharesCount || 0), 0);

      const calculatedScore = (user.points || 0) + (userCards.length * 10) + (totalLikes * 5);

      return {
        ...user,
        cardCount: userCards.length,
        totalLikes,
        totalDownloads,
        totalShares,
        score: calculatedScore
      };
    }).sort((a, b) => b.score - a.score);
  }

  // --- Activity Log ---
  logActivity(message) {
    const store = this.getStore();
    if (!store.activityLogs) store.activityLogs = [];
    store.activityLogs.unshift({
      id: "act_" + Date.now(),
      message,
      timestamp: new Date().toISOString()
    });
    if (store.activityLogs.length > 50) {
      store.activityLogs.pop();
    }
    this.saveStore(store);
  }

  getActivityLogs() {
    return this.getStore().activityLogs || [];
  }
}

const db = new Database();
