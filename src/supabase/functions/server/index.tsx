import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-68307d5a/health", (c) => {
  return c.json({ status: "ok" });
});

// Market data endpoints
app.get("/make-server-68307d5a/market-data", async (c) => {
  try {
    // Get cached market data or fetch new data
    let cachedData;
    try {
      cachedData = await kv.get("market_data");
    } catch (kvError) {
      console.log("KV store error, using fresh data:", kvError);
      cachedData = null;
    }
    
    if (cachedData && cachedData.timestamp && Date.now() - cachedData.timestamp < 30000) { // 30 seconds cache
      return c.json(cachedData.data);
    }
    
    // Simulate real-time market data
    const marketData = [
      {
        name: 'NGX ASI',
        value: 104250.5 + (Math.random() - 0.5) * 1000,
        change: (Math.random() - 0.5) * 5,
        status: Math.random() > 0.5 ? 'up' : 'down',
        currency: 'NGN'
      },
      {
        name: 'JSE All Share',
        value: 78450.2 + (Math.random() - 0.5) * 800,
        change: (Math.random() - 0.5) * 3,
        status: Math.random() > 0.5 ? 'up' : 'down',
        currency: 'ZAR'
      },
      {
        name: 'GSE CI',
        value: 3245.7 + (Math.random() - 0.5) * 100,
        change: (Math.random() - 0.5) * 2,
        status: Math.random() > 0.5 ? 'up' : 'down',
        currency: 'GHS'
      },
      {
        name: 'NSE 20',
        value: 1875.3 + (Math.random() - 0.5) * 50,
        change: (Math.random() - 0.5) * 1.5,
        status: Math.random() > 0.5 ? 'up' : 'down',
        currency: 'KES'
      }
    ];

    // Try to cache the data, but don't fail if caching fails
    try {
      await kv.set("market_data", {
        data: marketData,
        timestamp: Date.now()
      });
    } catch (cacheError) {
      console.log("Failed to cache market data:", cacheError);
    }

    return c.json(marketData);
  } catch (error) {
    console.log("Error in market data endpoint:", error);
    // Return fallback data even if everything fails
    const fallbackData = [
      {
        name: 'NGX ASI',
        value: 104250.5,
        change: 1.2,
        status: 'up',
        currency: 'NGN'
      },
      {
        name: 'JSE All Share',
        value: 78450.2,
        change: -0.8,
        status: 'down',
        currency: 'ZAR'
      }
    ];
    return c.json(fallbackData);
  }
});

// Investment performance data
app.get("/make-server-68307d5a/investment-performance", async (c) => {
  try {
    const cachedData = await kv.get("investment_performance");
    
    if (cachedData && Date.now() - cachedData.timestamp < 60000) { // 1 minute cache
      return c.json(cachedData.data);
    }

    const performanceData = [
      {
        name: "Nigerian High-Yield Bonds",
        currentReturn: 16.2 + (Math.random() - 0.5) * 2,
        risk: "Low",
        trend: "up",
        volume: Math.floor(Math.random() * 1000000) + 500000
      },
      {
        name: "Kenyan Equities Fund",
        currentReturn: 14.8 + (Math.random() - 0.5) * 3,
        risk: "Medium",
        trend: Math.random() > 0.5 ? "up" : "down",
        volume: Math.floor(Math.random() * 750000) + 250000
      },
      {
        name: "West African Tech Startups",
        currentReturn: 25.1 + (Math.random() - 0.5) * 5,
        risk: "High",
        trend: "up",
        volume: Math.floor(Math.random() * 500000) + 100000
      },
      {
        name: "South African REITs",
        currentReturn: 12.4 + (Math.random() - 0.5) * 2,
        risk: "Medium",
        trend: Math.random() > 0.5 ? "up" : "down",
        volume: Math.floor(Math.random() * 300000) + 150000
      }
    ];

    await kv.set("investment_performance", {
      data: performanceData,
      timestamp: Date.now()
    });

    return c.json(performanceData);
  } catch (error) {
    console.log("Error fetching investment performance:", error);
    return c.json({ error: "Failed to fetch investment performance" }, 500);
  }
});

// Social feed endpoints
app.get("/make-server-68307d5a/social-feed", async (c) => {
  try {
    let posts = [];
    try {
      posts = await kv.get("social_posts") || [];
    } catch (kvError) {
      console.log("KV store error, using empty feed:", kvError);
      posts = [];
    }
    
    // Ensure posts is an array
    if (!Array.isArray(posts)) {
      posts = [];
    }
    
    return c.json(posts);
  } catch (error) {
    console.log("Error fetching social feed:", error);
    return c.json([]);
  }
});

app.post("/make-server-68307d5a/social-post", async (c) => {
  try {
    const { content, user, type = "update" } = await c.req.json();
    
    if (!content || !user) {
      return c.json({ error: "Content and user are required" }, 400);
    }

    const post = {
      id: Date.now(),
      user,
      content,
      type,
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString(),
      createdAt: Date.now()
    };

    try {
      let existingPosts = [];
      try {
        existingPosts = await kv.get("social_posts") || [];
      } catch (kvError) {
        console.log("KV store error fetching posts:", kvError);
        existingPosts = [];
      }
      
      // Ensure existingPosts is an array
      if (!Array.isArray(existingPosts)) {
        existingPosts = [];
      }
      
      const updatedPosts = [post, ...existingPosts].slice(0, 50); // Keep only latest 50 posts
      
      await kv.set("social_posts", updatedPosts);
    } catch (kvError) {
      console.log("Failed to save post to KV store:", kvError);
    }
    
    return c.json(post);
  } catch (error) {
    console.log("Error creating social post:", error);
    return c.json({ error: "Failed to create post" }, 500);
  }
});

// Educational progress tracking
app.get("/make-server-68307d5a/user-progress/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const progress = await kv.get(`user_progress_${userId}`) || {
      completedCourses: [],
      achievements: [],
      totalLearningTime: 0
    };
    return c.json(progress);
  } catch (error) {
    console.log("Error fetching user progress:", error);
    return c.json({ error: "Failed to fetch user progress" }, 500);
  }
});

app.post("/make-server-68307d5a/user-progress/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const progressUpdate = await c.req.json();
    
    const existingProgress = await kv.get(`user_progress_${userId}`) || {
      completedCourses: [],
      achievements: [],
      totalLearningTime: 0
    };
    
    const updatedProgress = { ...existingProgress, ...progressUpdate };
    await kv.set(`user_progress_${userId}`, updatedProgress);
    
    return c.json(updatedProgress);
  } catch (error) {
    console.log("Error updating user progress:", error);
    return c.json({ error: "Failed to update user progress" }, 500);
  }
});

// User Profile Management
app.get("/make-server-68307d5a/user-profile/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const profile = await kv.get(`user_profile_${userId}`) || {
      id: userId,
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
      city: "",
      country: "",
      profileImage: "",
      bio: "",
      occupation: "",
      annualIncome: "",
      investmentExperience: "",
      riskTolerance: "",
      kycStatus: "pending",
      kycData: {},
      joinedCircles: [],
      investments: [],
      achievements: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    return c.json(profile);
  } catch (error) {
    console.log("Error fetching user profile:", error);
    return c.json({ error: "Failed to fetch user profile" }, 500);
  }
});

app.post("/make-server-68307d5a/user-profile/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const profileData = await c.req.json();
    
    const existingProfile = await kv.get(`user_profile_${userId}`) || {};
    
    const updatedProfile = {
      ...existingProfile,
      ...profileData,
      id: userId,
      updatedAt: Date.now()
    };
    
    await kv.set(`user_profile_${userId}`, updatedProfile);
    return c.json(updatedProfile);
  } catch (error) {
    console.log("Error updating user profile:", error);
    return c.json({ error: "Failed to update user profile" }, 500);
  }
});

// KYC Management
app.post("/make-server-68307d5a/kyc/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const kycData = await c.req.json();
    
    const profile = await kv.get(`user_profile_${userId}`) || {};
    
    const updatedProfile = {
      ...profile,
      kycData,
      kycStatus: "submitted",
      kycSubmittedAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await kv.set(`user_profile_${userId}`, updatedProfile);
    
    // Simulate KYC verification process (auto-approve for demo)
    setTimeout(async () => {
      try {
        const finalProfile = await kv.get(`user_profile_${userId}`);
        if (finalProfile) {
          finalProfile.kycStatus = "verified";
          finalProfile.kycVerifiedAt = Date.now();
          await kv.set(`user_profile_${userId}`, finalProfile);
        }
      } catch (error) {
        console.log("Error auto-verifying KYC:", error);
      }
    }, 5000); // Auto-verify after 5 seconds for demo
    
    return c.json(updatedProfile);
  } catch (error) {
    console.log("Error submitting KYC:", error);
    return c.json({ error: "Failed to submit KYC" }, 500);
  }
});

// Circles (Investment Communities) Management
app.get("/make-server-68307d5a/circles", async (c) => {
  try {
    const circles = await kv.get("investment_circles") || [
      {
        id: "tech-africa",
        name: "African Tech Investors",
        description: "Investing in African technology startups and innovation",
        category: "Technology",
        memberCount: 245,
        totalInvestment: 1250000,
        averageReturn: 18.5,
        image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=300&h=200&fit=crop",
        tags: ["tech", "startups", "innovation", "africa"],
        riskLevel: "High",
        minInvestment: 1000,
        createdAt: Date.now() - 86400000 * 30 // 30 days ago
      },
      {
        id: "bonds-stable",
        name: "Stable Bond Investors",
        description: "Focus on government and corporate bonds for stable returns",
        category: "Fixed Income",
        memberCount: 892,
        totalInvestment: 3450000,
        averageReturn: 12.3,
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop",
        tags: ["bonds", "stable", "government", "corporate"],
        riskLevel: "Low",
        minInvestment: 500,
        createdAt: Date.now() - 86400000 * 90 // 90 days ago
      },
      {
        id: "real-estate",
        name: "African Real Estate",
        description: "Real estate investment opportunities across Africa",
        category: "Real Estate",
        memberCount: 456,
        totalInvestment: 2100000,
        averageReturn: 15.2,
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop",
        tags: ["realestate", "property", "africa", "development"],
        riskLevel: "Medium",
        minInvestment: 2000,
        createdAt: Date.now() - 86400000 * 60 // 60 days ago
      },
      {
        id: "green-energy",
        name: "Green Energy Africa",
        description: "Sustainable energy investments across the continent",
        category: "Renewable Energy",
        memberCount: 178,
        totalInvestment: 890000,
        averageReturn: 22.1,
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300&h=200&fit=crop",
        tags: ["solar", "renewable", "sustainable", "climate"],
        riskLevel: "Medium",
        minInvestment: 1500,
        createdAt: Date.now() - 86400000 * 45 // 45 days ago
      },
      {
        id: "agriculture",
        name: "AgriTech Investors",
        description: "Agricultural technology and farming investments",
        category: "Agriculture",
        memberCount: 234,
        totalInvestment: 1100000,
        averageReturn: 16.8,
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&h=200&fit=crop",
        tags: ["agriculture", "farming", "agritech", "food"],
        riskLevel: "Medium",
        minInvestment: 800,
        createdAt: Date.now() - 86400000 * 75 // 75 days ago
      }
    ];
    return c.json(circles);
  } catch (error) {
    console.log("Error fetching circles:", error);
    return c.json([]);
  }
});

app.post("/make-server-68307d5a/circles/:circleId/join", async (c) => {
  try {
    const circleId = c.req.param("circleId");
    const { userId, userEmail } = await c.req.json();
    
    // Update user profile with joined circle
    const userProfile = await kv.get(`user_profile_${userId}`) || {};
    const joinedCircles = userProfile.joinedCircles || [];
    
    if (!joinedCircles.includes(circleId)) {
      joinedCircles.push(circleId);
      userProfile.joinedCircles = joinedCircles;
      userProfile.updatedAt = Date.now();
      await kv.set(`user_profile_${userId}`, userProfile);
      
      // Update circle membership
      const circleMembers = await kv.get(`circle_members_${circleId}`) || [];
      const memberExists = circleMembers.find(m => m.userId === userId);
      
      if (!memberExists) {
        circleMembers.push({
          userId,
          userEmail,
          joinedAt: Date.now()
        });
        await kv.set(`circle_members_${circleId}`, circleMembers);
        
        // Update circle stats
        const circles = await kv.get("investment_circles") || [];
        const circleIndex = circles.findIndex(c => c.id === circleId);
        if (circleIndex !== -1) {
          circles[circleIndex].memberCount = circleMembers.length;
          await kv.set("investment_circles", circles);
        }
      }
    }
    
    return c.json({ success: true, message: "Successfully joined circle" });
  } catch (error) {
    console.log("Error joining circle:", error);
    return c.json({ error: "Failed to join circle" }, 500);
  }
});

app.post("/make-server-68307d5a/circles/:circleId/leave", async (c) => {
  try {
    const circleId = c.req.param("circleId");
    const { userId } = await c.req.json();
    
    // Update user profile
    const userProfile = await kv.get(`user_profile_${userId}`) || {};
    const joinedCircles = userProfile.joinedCircles || [];
    userProfile.joinedCircles = joinedCircles.filter(id => id !== circleId);
    userProfile.updatedAt = Date.now();
    await kv.set(`user_profile_${userId}`, userProfile);
    
    // Update circle membership
    const circleMembers = await kv.get(`circle_members_${circleId}`) || [];
    const updatedMembers = circleMembers.filter(m => m.userId !== userId);
    await kv.set(`circle_members_${circleId}`, updatedMembers);
    
    // Update circle stats
    const circles = await kv.get("investment_circles") || [];
    const circleIndex = circles.findIndex(c => c.id === circleId);
    if (circleIndex !== -1) {
      circles[circleIndex].memberCount = updatedMembers.length;
      await kv.set("investment_circles", circles);
    }
    
    return c.json({ success: true, message: "Successfully left circle" });
  } catch (error) {
    console.log("Error leaving circle:", error);
    return c.json({ error: "Failed to leave circle" }, 500);
  }
});

app.get("/make-server-68307d5a/circles/:circleId/members", async (c) => {
  try {
    const circleId = c.req.param("circleId");
    const members = await kv.get(`circle_members_${circleId}`) || [];
    return c.json(members);
  } catch (error) {
    console.log("Error fetching circle members:", error);
    return c.json([]);
  }
});

// Circle discussions/posts
app.get("/make-server-68307d5a/circles/:circleId/posts", async (c) => {
  try {
    const circleId = c.req.param("circleId");
    const posts = await kv.get(`circle_posts_${circleId}`) || [];
    return c.json(posts);
  } catch (error) {
    console.log("Error fetching circle posts:", error);
    return c.json([]);
  }
});

app.post("/make-server-68307d5a/circles/:circleId/posts", async (c) => {
  try {
    const circleId = c.req.param("circleId");
    const { content, userId, userEmail } = await c.req.json();
    
    const post = {
      id: Date.now(),
      circleId,
      userId,
      userEmail,
      content,
      likes: 0,
      comments: [],
      createdAt: Date.now(),
      timestamp: new Date().toISOString()
    };
    
    const existingPosts = await kv.get(`circle_posts_${circleId}`) || [];
    const updatedPosts = [post, ...existingPosts].slice(0, 100); // Keep latest 100 posts
    await kv.set(`circle_posts_${circleId}`, updatedPosts);
    
    return c.json(post);
  } catch (error) {
    console.log("Error creating circle post:", error);
    return c.json({ error: "Failed to create post" }, 500);
  }
});

// User Investments Management
app.post("/make-server-68307d5a/user-investment/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const investmentData = await c.req.json();
    
    const userProfile = await kv.get(`user_profile_${userId}`) || {};
    const investments = userProfile.investments || [];
    
    const investment = {
      id: Date.now(),
      ...investmentData,
      createdAt: Date.now(),
      userId
    };
    
    investments.push(investment);
    userProfile.investments = investments;
    userProfile.updatedAt = Date.now();
    
    await kv.set(`user_profile_${userId}`, userProfile);
    
    return c.json(investment);
  } catch (error) {
    console.log("Error adding user investment:", error);
    return c.json({ error: "Failed to add investment" }, 500);
  }
});

Deno.serve(app.fetch);