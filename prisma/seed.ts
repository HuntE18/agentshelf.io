import {
  PrismaClient,
  PricingModel,
  ListingStatus,
  PremiumTier,
} from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================================
// Category definitions
// ============================================================================

const CATEGORIES = [
  {
    name: "Chatbots & LLMs",
    slug: "chatbots-llms",
    description:
      "Large language models, AI assistants, and conversational agents.",
    icon: "MessageSquare",
    color: "#4F46E5",
  },
  {
    name: "Code & Dev Tools",
    slug: "code-dev-tools",
    description:
      "AI-powered coding assistants, pair programmers, and developer productivity tools.",
    icon: "Code2",
    color: "#14B8A6",
  },
  {
    name: "Image Generation",
    slug: "image-generation",
    description:
      "Text-to-image models, creative AI, and visual content generators.",
    icon: "ImagePlus",
    color: "#8B5CF6",
  },
  {
    name: "Video & Audio",
    slug: "video-audio",
    description:
      "AI video generation, voice cloning, music creation, and media production.",
    icon: "Film",
    color: "#EC4899",
  },
  {
    name: "Writing & Content",
    slug: "writing-content",
    description:
      "AI writing assistants, content generators, and grammar tools.",
    icon: "PenLine",
    color: "#F59E0B",
  },
  {
    name: "Autonomous Agents",
    slug: "autonomous-agents",
    description:
      "Multi-agent frameworks, agentic workflows, and self-directed AI systems.",
    icon: "Bot",
    color: "#EF4444",
  },
  {
    name: "Workflow Automation",
    slug: "workflow-automation",
    description:
      "AI-powered automation platforms, no-code workflow builders, and integration tools.",
    icon: "Zap",
    color: "#10B981",
  },
  {
    name: "Productivity",
    slug: "productivity",
    description:
      "Meeting assistants, note-takers, presentation tools, and AI productivity boosters.",
    icon: "LayoutDashboard",
    color: "#0EA5E9",
  },
] as const;

// ============================================================================
// Listing definitions
// ============================================================================

type ListingInput = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  pricingModel: PricingModel;
  pricingDetails: string;
  status: ListingStatus;
  featured: boolean;
  premiumTier: PremiumTier;
  categorySlug: string;
  avgRating: number;
  reviewCount: number;
  viewCount: number;
};

const LISTINGS: ListingInput[] = [
  // ── Chatbots & LLMs ──────────────────────────────────────────────────────
  {
    name: "ChatGPT",
    slug: "chatgpt",
    tagline: "OpenAI's flagship conversational AI, now on every shelf.",
    description:
      "ChatGPT is the world's most widely-used AI assistant, built on OpenAI's GPT-4o family of models. It handles coding, writing, analysis, math, vision, and complex reasoning through a simple chat interface. The Plus and Pro tiers unlock faster responses, image generation via DALL·E 3, voice mode, and deep research capabilities. ChatGPT is available on web, iOS, Android, and macOS.",
    logoUrl: "https://logo.clearbit.com/openai.com",
    websiteUrl: "https://chatgpt.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free tier available. Plus $20/mo, Pro $200/mo.",
    status: ListingStatus.APPROVED,
    featured: true,
    premiumTier: PremiumTier.SPOTLIGHT,
    categorySlug: "chatbots-llms",
    avgRating: 4.7,
    reviewCount: 4,
    viewCount: 18420,
  },
  {
    name: "Claude",
    slug: "claude",
    tagline: "Anthropic's thoughtful AI with a 200K context window.",
    description:
      "Claude is Anthropic's AI assistant, engineered with a strong focus on safety, honesty, and helpfulness. The Claude 3.5 family (Haiku, Sonnet, Opus) offers models tuned for speed, balance, and maximum intelligence respectively. Claude excels at nuanced writing, long-document analysis, coding with its Artifacts feature, and multi-step reasoning. Its 200K token context window makes it ideal for processing entire codebases or book-length documents.",
    logoUrl: "https://logo.clearbit.com/anthropic.com",
    websiteUrl: "https://claude.ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free tier available. Pro $20/mo, Team $30/user/mo.",
    status: ListingStatus.APPROVED,
    featured: true,
    premiumTier: PremiumTier.SPOTLIGHT,
    categorySlug: "chatbots-llms",
    avgRating: 4.8,
    reviewCount: 3,
    viewCount: 14850,
  },
  {
    name: "Gemini",
    slug: "gemini",
    tagline: "Google's multimodal AI, native to the entire Google ecosystem.",
    description:
      "Gemini is Google DeepMind's flagship AI model family, available as a consumer product and via API. Gemini 1.5 Pro features a 1M token context window, enabling analysis of entire video files, large codebases, or thousands of documents in a single prompt. Gemini Advanced (powered by Gemini Ultra) is bundled with Google One AI Premium. Deep integration with Google Workspace (Docs, Sheets, Gmail) makes Gemini the natural AI layer for Google users.",
    logoUrl: "https://logo.clearbit.com/google.com",
    websiteUrl: "https://gemini.google.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free tier available. Advanced $19.99/mo (Google One AI Premium).",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "chatbots-llms",
    avgRating: 4.4,
    reviewCount: 0,
    viewCount: 9200,
  },
  {
    name: "Grok",
    slug: "grok",
    tagline: "xAI's witty, real-time AI with direct access to X (Twitter).",
    description:
      "Grok is the AI assistant built by xAI, Elon Musk's AI company. Uniquely, Grok has real-time access to posts on X, making it exceptionally strong at current events, trending topics, and live market data. Grok 2 offers strong reasoning, image understanding, and a less constrained personality compared to other frontier models. Grok is available to X Premium subscribers and via xAI's API.",
    logoUrl: "https://logo.clearbit.com/x.ai",
    websiteUrl: "https://x.ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Available with X Premium ($8/mo) or X Premium+ ($16/mo).",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "chatbots-llms",
    avgRating: 4.1,
    reviewCount: 0,
    viewCount: 5600,
  },
  {
    name: "Meta Llama",
    slug: "meta-llama",
    tagline: "Meta's open-weight models powering the open-source AI movement.",
    description:
      "Meta's Llama family (Llama 3.1, 3.2, 3.3) are open-weight large language models ranging from 1B to 405B parameters. Released under a permissive license, Llama models can be downloaded and run locally or deployed on any cloud provider. Llama 3.1 405B rivals frontier proprietary models on many benchmarks. Meta AI, the consumer product, integrates Llama across WhatsApp, Instagram, Facebook, and the web, making it one of the most-used AI products globally.",
    logoUrl: "https://logo.clearbit.com/meta.ai",
    websiteUrl: "https://meta.ai",
    pricingModel: PricingModel.FREE,
    pricingDetails: "Meta AI is free. Llama weights are free to download.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "chatbots-llms",
    avgRating: 4.3,
    reviewCount: 0,
    viewCount: 6100,
  },
  {
    name: "Mistral AI",
    slug: "mistral-ai",
    tagline: "European frontier models — powerful, efficient, and open.",
    description:
      "Mistral AI is a French AI company producing some of the most efficient frontier language models available. Their open models (Mistral 7B, Mixtral 8x7B, Mistral Nemo) punch above their weight class and are widely deployed in self-hosted environments. Mistral Large and Mistral Small are available via API (la Plateforme) and compete directly with GPT-4 at lower cost. Le Chat is their consumer product for conversational use.",
    logoUrl: "https://logo.clearbit.com/mistral.ai",
    websiteUrl: "https://mistral.ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Le Chat free. API from $0.002/1M tokens.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "chatbots-llms",
    avgRating: 4.4,
    reviewCount: 0,
    viewCount: 4800,
  },
  {
    name: "Cohere Command",
    slug: "cohere-command",
    tagline: "Enterprise-grade LLMs built for business retrieval and generation.",
    description:
      "Cohere builds large language models optimized for enterprise search, retrieval-augmented generation (RAG), and text classification. Command R+ is their flagship model, excelling at complex RAG workflows, tool use, and multi-step reasoning. Cohere's Embed and Rerank models are industry benchmarks for enterprise semantic search. Deployed on major cloud platforms (AWS Bedrock, Azure, GCP), Cohere is a favourite for Fortune 500 AI deployments.",
    logoUrl: "https://logo.clearbit.com/cohere.com",
    websiteUrl: "https://cohere.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free trial available. Production pricing from $1/1M tokens.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "chatbots-llms",
    avgRating: 4.2,
    reviewCount: 0,
    viewCount: 3200,
  },
  {
    name: "DeepSeek",
    slug: "deepseek",
    tagline: "Chinese frontier AI with top-tier reasoning at minimal cost.",
    description:
      "DeepSeek is a Chinese AI lab that shocked the AI world with DeepSeek-R1, an open-source reasoning model trained at a fraction of the cost of comparable US models. DeepSeek-V3 rivals GPT-4o on major benchmarks and is available for free via their chat interface. Their distilled R1 models can run on consumer hardware. The API is among the cheapest available for frontier-quality inference, making DeepSeek a compelling choice for high-volume applications.",
    logoUrl: "https://logo.clearbit.com/deepseek.com",
    websiteUrl: "https://deepseek.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Web chat free. API from $0.14/1M tokens (cache hit).",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "chatbots-llms",
    avgRating: 4.5,
    reviewCount: 0,
    viewCount: 7300,
  },
  {
    name: "Pi by Inflection",
    slug: "pi-inflection",
    tagline: "Your personal AI — empathetic, conversational, always available.",
    description:
      "Pi is a personal AI assistant developed by Inflection AI, designed to be a supportive and engaging conversational companion. Unlike task-oriented AI, Pi prioritizes emotional intelligence and natural back-and-forth conversation. It's designed for everyday use — discussing ideas, working through problems, or simply chatting. Pi learns your preferences over time and maintains continuity across conversations.",
    logoUrl: "https://logo.clearbit.com/pi.ai",
    websiteUrl: "https://pi.ai",
    pricingModel: PricingModel.FREE,
    pricingDetails: "Free to use.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "chatbots-llms",
    avgRating: 4.0,
    reviewCount: 0,
    viewCount: 2800,
  },
  {
    name: "Perplexity AI",
    slug: "perplexity-ai",
    tagline: "The AI-powered answer engine that cites every source.",
    description:
      "Perplexity AI is an AI-powered search engine that combines large language model reasoning with real-time web search. Every answer includes cited sources, making it the go-to tool for research, fact-checking, and staying current on any topic. Perplexity Pro unlocks more powerful models (GPT-4o, Claude, Sonar Large), file uploads, image generation, and higher daily search limits. Perplexity Pages lets you turn research into shareable, beautifully-formatted documents.",
    logoUrl: "https://logo.clearbit.com/perplexity.ai",
    websiteUrl: "https://perplexity.ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free tier available. Pro $20/mo.",
    status: ListingStatus.APPROVED,
    featured: true,
    premiumTier: PremiumTier.FEATURED,
    categorySlug: "chatbots-llms",
    avgRating: 4.6,
    reviewCount: 0,
    viewCount: 8900,
  },

  // ── Code & Dev Tools ─────────────────────────────────────────────────────
  {
    name: "GitHub Copilot",
    slug: "github-copilot",
    tagline: "Your AI pair programmer, built into every IDE.",
    description:
      "GitHub Copilot is the leading AI coding assistant, integrated directly into VS Code, JetBrains IDEs, Neovim, and GitHub.com. Powered by OpenAI Codex and GPT-4o, it provides line-by-line code completions, multi-line suggestions, docstring generation, and natural language to code translation. Copilot Chat adds conversational debugging and code explanation. Copilot Workspace previews an agentic end-to-end coding experience. Used by over 1.8 million developers.",
    logoUrl: "https://logo.clearbit.com/github.com",
    websiteUrl: "https://github.com/features/copilot",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free for students & open-source. Individual $10/mo, Business $19/user/mo.",
    status: ListingStatus.APPROVED,
    featured: true,
    premiumTier: PremiumTier.SPOTLIGHT,
    categorySlug: "code-dev-tools",
    avgRating: 4.6,
    reviewCount: 3,
    viewCount: 16200,
  },
  {
    name: "Cursor",
    slug: "cursor",
    tagline: "The AI-native code editor that edits entire codebases.",
    description:
      "Cursor is a fork of VS Code rebuilt around AI-first workflows. It supports inline edits, multi-file refactors, and a powerful Composer mode that can plan and execute changes across your entire codebase in a single chat. Cursor uses frontier models (GPT-4o, Claude 3.5 Sonnet) and maintains full codebase context with its proprietary indexing system. Features like @-mentions for files, symbols, and docs make context management seamless. Beloved by solo developers and startups.",
    logoUrl: "https://logo.clearbit.com/cursor.sh",
    websiteUrl: "https://cursor.sh",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free tier (2-week trial). Pro $20/mo, Business $40/user/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "code-dev-tools",
    avgRating: 4.8,
    reviewCount: 2,
    viewCount: 12400,
  },
  {
    name: "Replit AI",
    slug: "replit-ai",
    tagline: "Build and deploy full-stack apps from a single AI conversation.",
    description:
      "Replit is a browser-based IDE with deeply integrated AI capabilities. Replit AI (formerly Ghostwriter) provides code completion, debugging, and explanation within the editor. The AI Agent can build complete applications from natural language descriptions — scaffolding files, writing code, and deploying to a Replit subdomain automatically. With built-in hosting, databases, and secrets management, Replit is the fastest path from idea to deployed web app.",
    logoUrl: "https://logo.clearbit.com/replit.com",
    websiteUrl: "https://replit.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free tier available. Core $25/mo includes AI Agent access.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "code-dev-tools",
    avgRating: 4.3,
    reviewCount: 0,
    viewCount: 7600,
  },
  {
    name: "Claude Code",
    slug: "claude-code",
    tagline: "Anthropic's agentic coding tool that lives in your terminal.",
    description:
      "Claude Code is an agentic coding assistant that runs directly in your terminal and has full access to your local file system. It can read, write, and refactor files, run shell commands, execute tests, and interact with git — all from natural language instructions. Claude Code uses Claude 3.5 Sonnet under the hood and is designed for complex, multi-step software engineering tasks. Currently available as a research preview for select users.",
    logoUrl: "https://logo.clearbit.com/anthropic.com",
    websiteUrl: "https://claude.ai/code",
    pricingModel: PricingModel.PAID,
    pricingDetails: "Billed by API token usage (Claude API pricing).",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "code-dev-tools",
    avgRating: 4.7,
    reviewCount: 0,
    viewCount: 5900,
  },
  {
    name: "Amazon Q Developer",
    slug: "amazon-q-developer",
    tagline: "AWS's AI coding assistant with deep cloud integration.",
    description:
      "Amazon Q Developer (formerly CodeWhisperer) is AWS's AI coding assistant, tightly integrated with the AWS ecosystem. It provides real-time code suggestions, security vulnerability scanning, and can explain, refactor, and optimize code. Q Developer has native plugins for VS Code, JetBrains, and Visual Studio, and is embedded into the AWS Console for infrastructure tasks. Free for individual developers; Business tier adds admin controls and expanded usage.",
    logoUrl: "https://logo.clearbit.com/aws.amazon.com",
    websiteUrl: "https://aws.amazon.com/q/developer/",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free individual tier. Pro $19/user/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "code-dev-tools",
    avgRating: 4.1,
    reviewCount: 0,
    viewCount: 3800,
  },
  {
    name: "Tabnine",
    slug: "tabnine",
    tagline: "AI code completion that keeps your code private.",
    description:
      "Tabnine is one of the original AI coding assistants, predating GitHub Copilot. It offers AI-powered code completions with a strong emphasis on privacy and security — Tabnine can be deployed fully on-premises, keeping all code within your own infrastructure. It supports 80+ programming languages and integrates with all major IDEs. Enterprise customers benefit from custom model training on their own codebase, IP protection guarantees, and SOC 2 compliance.",
    logoUrl: "https://logo.clearbit.com/tabnine.com",
    websiteUrl: "https://tabnine.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free basic completions. Dev $12/mo, Enterprise custom pricing.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "code-dev-tools",
    avgRating: 4.0,
    reviewCount: 0,
    viewCount: 3100,
  },
  {
    name: "Cody by Sourcegraph",
    slug: "cody-sourcegraph",
    tagline: "AI coding assistant with enterprise-grade codebase context.",
    description:
      "Cody is Sourcegraph's AI coding assistant, built on top of their industry-leading code intelligence platform. What sets Cody apart is its ability to understand your entire codebase — not just the open files — using Sourcegraph's code graph. It can answer questions like 'how does authentication work in our app?' by searching and synthesizing across thousands of files. Cody supports multiple LLM backends (Claude, GPT-4) and is available as a VS Code / JetBrains extension.",
    logoUrl: "https://logo.clearbit.com/sourcegraph.com",
    websiteUrl: "https://sourcegraph.com/cody",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free for individuals. Enterprise from $19/user/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "code-dev-tools",
    avgRating: 4.2,
    reviewCount: 0,
    viewCount: 2700,
  },
  {
    name: "Windsurf by Codeium",
    slug: "windsurf-codeium",
    tagline: "The agentic IDE that pairs deep completions with Cascade flows.",
    description:
      "Windsurf is a VS Code-based AI IDE from Codeium, built around 'Cascade' — an agentic AI that can plan, reason, and take multi-step actions across your codebase. Unlike simple autocomplete, Cascade maintains awareness of your terminal, browser previews, and file changes to perform complex refactors and feature implementations autonomously. Codeium's underlying models are trained specifically for code, offering fast and accurate completions without rate limits on the free tier.",
    logoUrl: "https://logo.clearbit.com/codeium.com",
    websiteUrl: "https://codeium.com/windsurf",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free tier available. Pro $15/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "code-dev-tools",
    avgRating: 4.5,
    reviewCount: 0,
    viewCount: 6400,
  },
  {
    name: "Bolt.new",
    slug: "bolt-new",
    tagline: "Prompt-to-full-stack-app in seconds, deployed instantly.",
    description:
      "Bolt.new is StackBlitz's AI-powered full-stack app builder. Type a description of what you want to build, and Bolt generates a complete React, Next.js, or Astro application — including routing, components, and API routes — running live in your browser within seconds. The in-browser editor lets you make adjustments, and apps can be deployed to Netlify with one click. Bolt is powered by Anthropic's Claude and is particularly popular for rapid prototyping.",
    logoUrl: "https://logo.clearbit.com/bolt.new",
    websiteUrl: "https://bolt.new",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free tier (limited tokens). Pro $20/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "code-dev-tools",
    avgRating: 4.4,
    reviewCount: 0,
    viewCount: 8100,
  },
  {
    name: "v0 by Vercel",
    slug: "v0-vercel",
    tagline: "Generate polished React/shadcn UI components from text prompts.",
    description:
      "v0 is Vercel's AI UI generation tool that converts text descriptions and screenshots into production-ready React components using Tailwind CSS and shadcn/ui. Design, iterate, and copy components directly into your Next.js project. v0 understands design system conventions and can generate complex layouts, data tables, forms, and dashboards. Deeply integrated with the Vercel deployment platform, making it the go-to tool for Next.js developers.",
    logoUrl: "https://logo.clearbit.com/v0.dev",
    websiteUrl: "https://v0.dev",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free tier available. Premium $20/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "code-dev-tools",
    avgRating: 4.5,
    reviewCount: 0,
    viewCount: 9800,
  },

  // ── Image Generation ─────────────────────────────────────────────────────
  {
    name: "Midjourney",
    slug: "midjourney",
    tagline: "The gold standard for stunning AI art and photorealistic images.",
    description:
      "Midjourney is the dominant creative AI image generator, used by professional designers, artists, and content creators worldwide. Accessed primarily through Discord or the Midjourney.com web interface, it produces visually breathtaking images from text prompts with a uniquely aesthetic quality. Midjourney V6.1 delivers exceptional photorealism, coherent text rendering, and nuanced stylistic control. Features like Vary (Region), Zoom Out, and Personalization make iteration effortless.",
    logoUrl: "https://logo.clearbit.com/midjourney.com",
    websiteUrl: "https://midjourney.com",
    pricingModel: PricingModel.PAID,
    pricingDetails: "Basic $10/mo, Standard $30/mo, Pro $60/mo, Mega $120/mo.",
    status: ListingStatus.APPROVED,
    featured: true,
    premiumTier: PremiumTier.FEATURED,
    categorySlug: "image-generation",
    avgRating: 4.9,
    reviewCount: 2,
    viewCount: 15600,
  },
  {
    name: "DALL·E 3",
    slug: "dall-e-3",
    tagline: "OpenAI's image generator with remarkable prompt adherence.",
    description:
      "DALL·E 3 is OpenAI's image generation model, notable for its dramatically improved prompt following compared to previous versions. It understands nuanced, complex prompts — including accurate text rendering within images — and produces highly coherent compositions. Available via ChatGPT Plus/Pro (integrated directly into conversations) and the OpenAI API. DALL·E 3 automatically enhances prompts for better results and applies content safety filters for responsible use.",
    logoUrl: "https://logo.clearbit.com/openai.com",
    websiteUrl: "https://openai.com/dall-e-3",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Included with ChatGPT Plus ($20/mo). API: $0.04–$0.12 per image.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "image-generation",
    avgRating: 4.4,
    reviewCount: 0,
    viewCount: 7800,
  },
  {
    name: "Stable Diffusion",
    slug: "stable-diffusion",
    tagline: "The open-source image model that runs on your own hardware.",
    description:
      "Stable Diffusion by Stability AI is the foundational open-source text-to-image model that democratized AI art generation. Unlike cloud-only services, it can be run locally on consumer GPUs (or even CPUs), with full customization via LoRA fine-tuning, ControlNet for pose/depth guidance, and thousands of community-trained models on Civitai. SDXL and SD3 deliver professional quality. Access it via Automatic1111, ComfyUI, or Stability AI's hosted platform.",
    logoUrl: "https://logo.clearbit.com/stability.ai",
    websiteUrl: "https://stability.ai",
    pricingModel: PricingModel.OPEN_SOURCE,
    pricingDetails: "Model weights free. Stable Diffusion API from $0.002/step. DreamStudio credits available.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "image-generation",
    avgRating: 4.5,
    reviewCount: 0,
    viewCount: 8400,
  },
  {
    name: "Adobe Firefly",
    slug: "adobe-firefly",
    tagline: "Commercially safe AI generation built for Creative Cloud.",
    description:
      "Adobe Firefly is Adobe's family of generative AI models designed specifically for creative professionals. Unlike competitors, Firefly is trained exclusively on licensed Adobe Stock content and public domain material, making outputs fully commercially safe. It's deeply integrated into Photoshop (Generative Fill), Illustrator (Generative Expand), Premiere Pro (AI-powered audio/video tools), and Express. Firefly 3 produces outstanding image quality and best-in-class text rendering.",
    logoUrl: "https://logo.clearbit.com/adobe.com",
    websiteUrl: "https://firefly.adobe.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "25 monthly generative credits free. Included in Creative Cloud plans.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "image-generation",
    avgRating: 4.3,
    reviewCount: 0,
    viewCount: 5200,
  },
  {
    name: "Ideogram",
    slug: "ideogram",
    tagline: "AI image generation with the best text rendering in the industry.",
    description:
      "Ideogram is an AI image generator purpose-built to render text accurately within images — a longstanding weakness of other models. Ideogram 2.0 produces high-quality logos, posters, banners, and typographic designs where text is a first-class element. Its style presets, canvas feature, and remix tools make iteration fast. Ideogram is popular with graphic designers, social media creators, and marketers who need legible text in generated visuals.",
    logoUrl: "https://logo.clearbit.com/ideogram.ai",
    websiteUrl: "https://ideogram.ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free tier (10 slow images/day). Basic $8/mo, Plus $20/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "image-generation",
    avgRating: 4.5,
    reviewCount: 0,
    viewCount: 4300,
  },
  {
    name: "Leonardo AI",
    slug: "leonardo-ai",
    tagline: "Creative AI platform for game assets, art, and visual design.",
    description:
      "Leonardo AI is a comprehensive AI creative platform offering image generation, canvas editing, real-time generation, and a growing model ecosystem. It's particularly popular in game development, with purpose-built features for character design, concept art, texture generation, and consistent asset creation. Leonardo hosts hundreds of community fine-tuned models alongside its own Leonardo Phoenix and Kino XL models. The LCM real-time canvas is a standout feature for rapid ideation.",
    logoUrl: "https://logo.clearbit.com/leonardo.ai",
    websiteUrl: "https://leonardo.ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free tier (150 tokens/day). Apprentice $12/mo, Artisan $30/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "image-generation",
    avgRating: 4.4,
    reviewCount: 0,
    viewCount: 5700,
  },
  {
    name: "Flux by Black Forest Labs",
    slug: "flux-black-forest-labs",
    tagline: "State-of-the-art open image generation from Stable Diffusion's creators.",
    description:
      "Flux is the image generation model family from Black Forest Labs, founded by former Stability AI researchers. Flux.1 [pro], [dev], and [schnell] set new benchmarks for image quality, prompt adherence, and diversity representation upon release. The open-weights [schnell] and [dev] models can be run locally or via API providers like Replicate and Fal.ai. Flux Pro and Ultra are available via API for commercial use. Widely considered the current best-in-class open image generation model.",
    logoUrl: "https://logo.clearbit.com/blackforestlabs.ai",
    websiteUrl: "https://blackforestlabs.ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Schnell/Dev weights open. Pro API from $0.055/image.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "image-generation",
    avgRating: 4.7,
    reviewCount: 0,
    viewCount: 6800,
  },

  // ── Video & Audio ─────────────────────────────────────────────────────────
  {
    name: "Runway Gen-3",
    slug: "runway-gen-3",
    tagline: "Hollywood-grade AI video generation for professional creators.",
    description:
      "Runway is the leading AI video generation platform, used on productions ranging from indie films to major studio projects. Gen-3 Alpha produces high-fidelity, temporally consistent video clips from text and image prompts, with fine-grained control over camera motion, style, and subject movement. Runway's suite also includes AI video editing tools: inpainting, background removal, motion tracking, and the groundbreaking Act One facial performance capture system.",
    logoUrl: "https://logo.clearbit.com/runwayml.com",
    websiteUrl: "https://runwayml.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "125 free credits/mo. Standard $15/mo, Pro $35/mo, Unlimited $95/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "video-audio",
    avgRating: 4.5,
    reviewCount: 0,
    viewCount: 7200,
  },
  {
    name: "Sora by OpenAI",
    slug: "sora-openai",
    tagline: "OpenAI's groundbreaking text-to-video model for creative storytelling.",
    description:
      "Sora is OpenAI's text-to-video model that creates realistic and imaginative scenes from text descriptions. It can generate videos up to a minute long maintaining high visual quality and adherence to the user's prompt. Sora understands complex prompts including multiple characters, specific motions, and accurate details of subjects and backgrounds. It also handles image-to-video, video extension, and video editing (Storyboard). Available to ChatGPT Plus and Pro subscribers.",
    logoUrl: "https://logo.clearbit.com/openai.com",
    websiteUrl: "https://sora.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Included with ChatGPT Plus ($20/mo) and Pro ($200/mo).",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "video-audio",
    avgRating: 4.4,
    reviewCount: 0,
    viewCount: 9100,
  },
  {
    name: "ElevenLabs",
    slug: "elevenlabs",
    tagline: "The world's most realistic AI voice and audio platform.",
    description:
      "ElevenLabs produces the most natural-sounding AI voice synthesis available, supporting 29 languages and hundreds of voice styles. Their voice cloning technology can replicate any voice from a 1-minute audio sample. ElevenLabs powers podcasts, audiobooks, video dubbing, interactive game NPCs, and accessibility tools. The AI Dubbing feature maintains the original speaker's voice while translating content into a target language. Projects, Studio, and SFX tools make it a complete audio production platform.",
    logoUrl: "https://logo.clearbit.com/elevenlabs.io",
    websiteUrl: "https://elevenlabs.io",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free (10K chars/mo). Starter $5/mo, Creator $22/mo, Pro $99/mo.",
    status: ListingStatus.APPROVED,
    featured: true,
    premiumTier: PremiumTier.FEATURED,
    categorySlug: "video-audio",
    avgRating: 4.8,
    reviewCount: 2,
    viewCount: 11300,
  },
  {
    name: "Suno AI",
    slug: "suno-ai",
    tagline: "Generate full songs with vocals and instrumentation from a text prompt.",
    description:
      "Suno AI is the leading AI music generation platform, capable of creating complete songs — with realistic vocals, lyrics, melody, and instrumentation — from a simple text description. Describe a genre, mood, and theme, and Suno produces two 2-minute tracks in seconds. Suno v4 delivers significantly improved audio quality, longer songs up to 4 minutes, and better voice consistency. Used by musicians for demos, content creators for background music, and hobbyists exploring songwriting.",
    logoUrl: "https://logo.clearbit.com/suno.com",
    websiteUrl: "https://suno.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free (50 credits/day). Pro $8/mo, Premier $24/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "video-audio",
    avgRating: 4.5,
    reviewCount: 0,
    viewCount: 6700,
  },
  {
    name: "HeyGen",
    slug: "heygen",
    tagline: "Create professional AI-avatar videos without cameras or studios.",
    description:
      "HeyGen is an AI video platform that creates studio-quality videos using digital avatars and voice synthesis. Upload a photo or short video clip to create a personalized avatar that delivers scripted content with lip-synced speech. HeyGen is widely used for product marketing videos, employee training, sales outreach personalization, and multilingual content localization. The Video Translation feature maintains your original appearance while dubbing your video into 40+ languages.",
    logoUrl: "https://logo.clearbit.com/heygen.com",
    websiteUrl: "https://heygen.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "1 free video/mo. Creator $29/mo, Team $89/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "video-audio",
    avgRating: 4.3,
    reviewCount: 0,
    viewCount: 4900,
  },
  {
    name: "Descript",
    slug: "descript",
    tagline: "Edit audio and video by editing the transcript — AI-powered production.",
    description:
      "Descript is a revolutionary audio and video editing platform that works like a word processor. Edit your podcast or video by simply editing the auto-generated transcript — delete a word from the text and it disappears from the recording. AI features include Overdub (voice cloning to fix mistakes), Studio Sound (professional noise removal), Eye Contact correction, filler word removal, and AI-powered clip creation for social media. Used by podcasters, YouTubers, and corporate communications teams.",
    logoUrl: "https://logo.clearbit.com/descript.com",
    websiteUrl: "https://descript.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free tier available. Hobbyist $12/mo, Creator $24/mo, Business $40/user/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "video-audio",
    avgRating: 4.4,
    reviewCount: 0,
    viewCount: 4100,
  },

  // ── Writing & Content ─────────────────────────────────────────────────────
  {
    name: "Jasper AI",
    slug: "jasper-ai",
    tagline: "Enterprise AI content platform for marketing and brand teams.",
    description:
      "Jasper is an AI writing and content platform designed for enterprise marketing teams. It combines frontier LLMs with brand voice training, allowing companies to generate on-brand blog posts, ad copy, emails, and social media content at scale. Jasper integrates with SurferSEO for optimization, Canva for visuals, and major CMS platforms. The Campaigns feature automates multi-channel content briefs and production. Used by teams at Airbnb, Lush, and HubSpot.",
    logoUrl: "https://logo.clearbit.com/jasper.ai",
    websiteUrl: "https://jasper.ai",
    pricingModel: PricingModel.PAID,
    pricingDetails: "Creator $49/mo, Teams $125/mo, Business custom pricing.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "writing-content",
    avgRating: 4.2,
    reviewCount: 0,
    viewCount: 5100,
  },
  {
    name: "Copy.ai",
    slug: "copy-ai",
    tagline: "Go-to-market AI that automates your entire content workflow.",
    description:
      "Copy.ai is a GTM AI platform that automates the content and workflow processes for sales and marketing teams. Beyond simple copy generation, Copy.ai offers Workflows — automated pipelines that can research prospects, generate personalized outreach, create product descriptions at scale, and run entire content calendars without human intervention. Supports 95+ languages and integrates with HubSpot, Salesforce, and major marketing tools.",
    logoUrl: "https://logo.clearbit.com/copy.ai",
    websiteUrl: "https://copy.ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free plan (2K words/mo). Starter $36/mo, Advanced $186/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "writing-content",
    avgRating: 4.1,
    reviewCount: 0,
    viewCount: 3800,
  },
  {
    name: "Writesonic",
    slug: "writesonic",
    tagline: "AI writer with built-in SEO and real-time web search.",
    description:
      "Writesonic is an AI writing tool that combines content generation with real-time web research. Chatsonic, its conversational assistant, has access to current web data — overcoming the knowledge cutoff limitation of standard LLMs. Writesonic produces long-form blog posts, product descriptions, landing page copy, and social content. The built-in Surfer SEO integration ensures content is optimized for search engines. Supports 25+ languages and 100+ templates.",
    logoUrl: "https://logo.clearbit.com/writesonic.com",
    websiteUrl: "https://writesonic.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free trial available. Individual $20/mo, Teams $19/user/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "writing-content",
    avgRating: 4.0,
    reviewCount: 0,
    viewCount: 3200,
  },
  {
    name: "Grammarly",
    slug: "grammarly",
    tagline: "AI writing assistance that makes every communication polished.",
    description:
      "Grammarly is the world's leading AI-powered writing assistant, used by over 30 million people daily. Beyond grammar and spell checking, Grammarly provides tone detection, clarity suggestions, engagement scoring, and style improvements. GrammarlyGO adds full generative AI capabilities — rewriting, summarizing, replying, and composing from scratch. It works as a browser extension, Windows/Mac app, and integrates natively into Google Docs, Microsoft Word, and most email clients.",
    logoUrl: "https://logo.clearbit.com/grammarly.com",
    websiteUrl: "https://grammarly.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free tier available. Premium $12/mo, Business $15/user/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "writing-content",
    avgRating: 4.4,
    reviewCount: 0,
    viewCount: 8600,
  },
  {
    name: "Notion AI",
    slug: "notion-ai",
    tagline: "AI built into your workspace — write, summarize, and brainstorm in Notion.",
    description:
      "Notion AI brings the power of generative AI directly into Notion's workspace. It can write first drafts, summarize long documents, translate content, fix grammar, extract action items from meeting notes, and answer questions about your connected workspace. The Q&A feature allows natural language queries across your entire Notion database. As an add-on to any Notion plan, it's the natural choice for teams already working in Notion. Powered by Anthropic's Claude and OpenAI's models.",
    logoUrl: "https://logo.clearbit.com/notion.so",
    websiteUrl: "https://notion.so/product/ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Add-on $8/user/mo (annual) to any Notion plan.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "writing-content",
    avgRating: 4.3,
    reviewCount: 0,
    viewCount: 5900,
  },

  // ── Autonomous Agents ─────────────────────────────────────────────────────
  {
    name: "AutoGPT",
    slug: "autogpt",
    tagline: "The original autonomous AI agent — give it a goal and watch it work.",
    description:
      "AutoGPT was one of the first open-source autonomous AI agents, demonstrating that GPT-4 could chain its own thoughts, search the web, manage memory, and execute tasks with minimal human intervention. The AutoGPT platform (agpt.co) has since evolved into a no-code agent builder where anyone can create, run, and share AI agents. The open-source project has over 165K GitHub stars and inspired the modern autonomous AI agent movement.",
    logoUrl: "https://logo.clearbit.com/agpt.co",
    websiteUrl: "https://agpt.co",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Open-source self-hosted free. Cloud platform freemium.",
    status: ListingStatus.APPROVED,
    featured: true,
    premiumTier: PremiumTier.FEATURED,
    categorySlug: "autonomous-agents",
    avgRating: 4.0,
    reviewCount: 2,
    viewCount: 9400,
  },
  {
    name: "CrewAI",
    slug: "crewai",
    tagline: "Orchestrate teams of AI agents to tackle complex, real-world tasks.",
    description:
      "CrewAI is a Python framework for orchestrating role-playing, autonomous AI agents that collaborate like a human team. You define agents with specific roles, backstories, and tools — a Researcher, a Writer, an Analyst — then assign them tasks that feed into each other. CrewAI handles the orchestration, memory sharing, and tool execution. The CrewAI platform provides a no-code interface, deployment infrastructure, and pre-built crew templates for common use cases like lead research and content production.",
    logoUrl: "https://logo.clearbit.com/crewai.com",
    websiteUrl: "https://crewai.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Open-source framework free. Enterprise platform custom pricing.",
    status: ListingStatus.APPROVED,
    featured: true,
    premiumTier: PremiumTier.FEATURED,
    categorySlug: "autonomous-agents",
    avgRating: 4.6,
    reviewCount: 2,
    viewCount: 10200,
  },
  {
    name: "LangChain",
    slug: "langchain",
    tagline: "The composable framework for building LLM-powered applications.",
    description:
      "LangChain is the most widely-used framework for building applications powered by large language models. It provides composable abstractions for chains, agents, retrieval (RAG), memory, and tool use — supporting all major LLM providers. LangSmith offers observability and evaluation for production LLM apps. LangGraph enables stateful, graph-based multi-agent architectures. LangChain Hub is a marketplace for sharing prompts and chains. The ecosystem has over 90K GitHub stars.",
    logoUrl: "https://logo.clearbit.com/langchain.com",
    websiteUrl: "https://langchain.com",
    pricingModel: PricingModel.OPEN_SOURCE,
    pricingDetails: "Open-source framework free. LangSmith from $39/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "autonomous-agents",
    avgRating: 4.3,
    reviewCount: 0,
    viewCount: 7800,
  },
  {
    name: "Microsoft AutoGen",
    slug: "microsoft-autogen",
    tagline: "Microsoft's framework for multi-agent conversation and task solving.",
    description:
      "AutoGen is Microsoft Research's open-source framework for building next-generation LLM applications using multiple conversational agents. Agents in AutoGen can converse with each other to solve tasks, using LLMs, human feedback, and tools in combination. It supports complex workflows through customizable and conversable agents, human-in-the-loop patterns, and code execution. AutoGen Studio provides a low-code interface for prototyping multi-agent systems visually.",
    logoUrl: "https://logo.clearbit.com/microsoft.com",
    websiteUrl: "https://microsoft.github.io/autogen/",
    pricingModel: PricingModel.OPEN_SOURCE,
    pricingDetails: "Fully open-source and free.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "autonomous-agents",
    avgRating: 4.2,
    reviewCount: 0,
    viewCount: 4700,
  },
  {
    name: "BabyAGI",
    slug: "babyagi",
    tagline: "Minimal, elegant task-driven autonomous agent using vector memory.",
    description:
      "BabyAGI is one of the earliest autonomous AI agents, designed as a minimal task-management system that uses GPT-4 and vector databases (Pinecone) to create, prioritize, and execute tasks toward a given goal. While simple in design, it pioneered the concept of AI systems that self-generate their own task lists and iterate toward objectives. The original Python script has over 19K GitHub stars and served as a blueprint for many subsequent agent frameworks.",
    logoUrl: "https://logo.clearbit.com/babyagi.org",
    websiteUrl: "https://babyagi.org",
    pricingModel: PricingModel.OPEN_SOURCE,
    pricingDetails: "Open-source and free to run locally.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "autonomous-agents",
    avgRating: 3.8,
    reviewCount: 0,
    viewCount: 3200,
  },
  {
    name: "Phidata",
    slug: "phidata",
    tagline: "Build production-ready AI agents with memory, knowledge, and tools.",
    description:
      "Phidata is a Python framework for building multimodal AI agents with long-term memory, knowledge retrieval, and built-in tool integrations. Agents built with Phidata can search the web, query databases, write and execute code, and maintain structured memory across sessions. It ships with ready-made agent templates for financial analysis, research, coding, and more. The Phidata cloud platform provides one-click deployment, team collaboration, and agent monitoring.",
    logoUrl: "https://logo.clearbit.com/phidata.com",
    websiteUrl: "https://phidata.com",
    pricingModel: PricingModel.OPEN_SOURCE,
    pricingDetails: "Open-source framework free. Cloud platform has paid tiers.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "autonomous-agents",
    avgRating: 4.3,
    reviewCount: 0,
    viewCount: 2900,
  },
  {
    name: "Composio",
    slug: "composio",
    tagline: "100+ managed integrations for AI agents — GitHub, Slack, Gmail, and more.",
    description:
      "Composio is an integration platform for AI agents, providing over 100 production-ready tool integrations that agents can use to interact with external services. Rather than building your own integrations for GitHub, Slack, Gmail, Notion, Salesforce, and more, Composio handles authentication, rate limiting, error handling, and schema management. Fully compatible with LangChain, CrewAI, AutoGen, and any LLM provider. Makes agent tool use production-grade from day one.",
    logoUrl: "https://logo.clearbit.com/composio.dev",
    websiteUrl: "https://composio.dev",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Generous free tier. Scale and Enterprise custom pricing.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "autonomous-agents",
    avgRating: 4.4,
    reviewCount: 0,
    viewCount: 2600,
  },

  // ── Workflow Automation ───────────────────────────────────────────────────
  {
    name: "Zapier AI",
    slug: "zapier-ai",
    tagline: "Connect 7,000+ apps and automate workflows with natural language.",
    description:
      "Zapier is the leading no-code automation platform, connecting over 7,000 apps through automated workflows called Zaps. The Zapier AI features allow users to build Zaps from natural language descriptions and use AI actions within automations — including ChatGPT, Claude, and custom AI prompts. Zapier Agents enable fully autonomous AI workflows that monitor triggers, make decisions, and take actions across apps. Used by over 2 million businesses to automate everything from lead management to social posting.",
    logoUrl: "https://logo.clearbit.com/zapier.com",
    websiteUrl: "https://zapier.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free (100 tasks/mo). Starter $19.99/mo, Professional $49/mo, Team $69/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "workflow-automation",
    avgRating: 4.4,
    reviewCount: 0,
    viewCount: 6800,
  },
  {
    name: "Make",
    slug: "make",
    tagline: "Visual automation platform for complex multi-step workflows.",
    description:
      "Make (formerly Integromat) is a visual automation platform that lets you design, build, and automate complex workflows without coding. Its drag-and-drop scenario builder handles advanced data transformation, conditional logic, iterators, and aggregators that simple linear tools like Zapier can't manage. Make integrates with 1,500+ apps and supports HTTP, webhooks, and custom APIs for limitless extensibility. AI modules connect to OpenAI, Anthropic, and Hugging Face. Highly popular with agencies and power users.",
    logoUrl: "https://logo.clearbit.com/make.com",
    websiteUrl: "https://make.com",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free (1K operations/mo). Core $10.59/mo, Pro $18.82/mo, Teams $34.12/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "workflow-automation",
    avgRating: 4.5,
    reviewCount: 0,
    viewCount: 5100,
  },

  // ── Productivity ──────────────────────────────────────────────────────────
  {
    name: "Otter.ai",
    slug: "otter-ai",
    tagline: "Real-time meeting transcription and AI summary for every call.",
    description:
      "Otter.ai provides real-time transcription, automatic meeting summaries, and action item extraction for video calls and in-person meetings. It integrates directly with Zoom, Google Meet, and Microsoft Teams, joining as a bot participant and producing searchable, speaker-labelled transcripts within minutes. OtterPilot can generate follow-up emails, push action items to CRM tools, and answer questions about meeting content via AI chat. Used by sales teams, researchers, journalists, and students.",
    logoUrl: "https://logo.clearbit.com/otter.ai",
    websiteUrl: "https://otter.ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free (600 min/mo). Pro $16.99/mo, Business $30/user/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "productivity",
    avgRating: 4.3,
    reviewCount: 0,
    viewCount: 4200,
  },
  {
    name: "Fireflies.ai",
    slug: "fireflies-ai",
    tagline: "AI meeting assistant that records, transcribes, and analyzes every call.",
    description:
      "Fireflies.ai is an AI meeting assistant that automatically joins your video calls to record, transcribe, and analyze conversations. It supports 60+ languages, identifies speakers, and generates smart summaries, key topics, action items, and conversation metrics. AskFred, its AI chat assistant, can answer questions about any past meeting. CRM integrations push meeting notes directly to Salesforce, HubSpot, and other tools. Used by over 500,000 teams for sales, recruiting, and project management.",
    logoUrl: "https://logo.clearbit.com/fireflies.ai",
    websiteUrl: "https://fireflies.ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free (800 min storage). Pro $18/user/mo, Business $29/user/mo.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "productivity",
    avgRating: 4.4,
    reviewCount: 0,
    viewCount: 3800,
  },
  {
    name: "Synthesia",
    slug: "synthesia",
    tagline: "Create professional AI avatar videos in 130+ languages — no camera needed.",
    description:
      "Synthesia is the leading AI video generation platform for business communications, training, and e-learning. Users type a script, choose from 140+ AI avatars (or create a custom avatar from their own likeness), and generate a polished video in minutes. Synthesia supports 130+ languages, making multilingual video production effortless. Features include SCORM export for LMS integration, brand templates, screen recording overlay, and an enterprise-grade content management system.",
    logoUrl: "https://logo.clearbit.com/synthesia.io",
    websiteUrl: "https://synthesia.io",
    pricingModel: PricingModel.FREEMIUM,
    pricingDetails: "Free (3 videos/mo). Starter $29/mo, Creator $89/mo, Enterprise custom.",
    status: ListingStatus.APPROVED,
    featured: false,
    premiumTier: PremiumTier.BASIC,
    categorySlug: "productivity",
    avgRating: 4.3,
    reviewCount: 0,
    viewCount: 3600,
  },
];

// ============================================================================
// Seed review data
// ============================================================================

type SeedReview = {
  listingSlug: string;
  authorEmail: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  pros: string;
  cons: string;
};

const SEED_REVIEWS: SeedReview[] = [
  // ChatGPT — 4 reviews
  {
    listingSlug: "chatgpt",
    authorEmail: "alex.dev@example.com",
    authorName: "Alex Chen",
    rating: 5,
    title: "Replaced half my productivity stack",
    body: "I've been using ChatGPT Plus daily for over a year and it's genuinely transformed how I work. The combination of GPT-4o's reasoning, the code interpreter, and DALL·E 3 in one subscription is absurd value. I use it for everything from drafting emails and debugging code to brainstorming and data analysis. The Advanced Data Analysis mode has replaced several paid tools for me.",
    pros: "Exceptionally versatile, code interpreter is incredibly powerful, great memory feature, fast responses on Plus",
    cons: "Can still hallucinate confidently, context gets confused on very long conversations, no internet access on free tier",
  },
  {
    listingSlug: "chatgpt",
    authorEmail: "mira.writes@example.com",
    authorName: "Mira Santos",
    rating: 4,
    title: "Best all-around assistant, but not always the smartest",
    body: "ChatGPT is my starting point for almost everything — it's reliable, fast, and covers every use case I throw at it. That said, for deep analytical tasks or nuanced writing, Claude often edges it out. The free tier is now surprisingly capable with GPT-4o mini, making it the best entry-level option by far. Voice mode is genuinely impressive and useful for hands-free thinking sessions.",
    pros: "Massive feature set, excellent free tier, voice mode is best-in-class, huge plugin/GPT ecosystem",
    cons: "Not always the strongest at complex reasoning, sometimes too verbose, GPT store quality is inconsistent",
  },
  {
    listingSlug: "chatgpt",
    authorEmail: "jose.pm@example.com",
    authorName: "José Ramirez",
    rating: 5,
    title: "The Swiss Army knife of AI tools",
    body: "As a product manager, I use ChatGPT for user story drafting, competitive analysis, interview question generation, meeting summaries, and quick data lookups. The Custom GPTs let me build lightweight tools for my team without writing code. The canvas feature for collaborative document editing is a recent addition I didn't know I needed. Solid 5 stars for versatility alone.",
    pros: "Custom GPTs for specialized workflows, canvas for collaborative editing, excellent for PM tasks, mobile app is polished",
    cons: "Pro plan at $200/mo is expensive, rate limits can frustrate on heavy workloads even on Plus",
  },
  {
    listingSlug: "chatgpt",
    authorEmail: "nina.research@example.com",
    authorName: "Nina Volkov",
    rating: 4,
    title: "Indispensable for research, with a few caveats",
    body: "ChatGPT with browsing enabled is my first stop for any research task. The ability to ask follow-up questions and drill deeper is far better than traditional search. My main gripes are the occasional confident hallucinations on niche topics and the sometimes overly cautious refusals. Deep Research mode is impressive but can take 10+ minutes. Overall, the productivity gains are massive.",
    pros: "Deep Research mode produces genuinely thorough reports, good at synthesizing information, browsing is reliable",
    cons: "Hallucination on less-known topics, occasional overly restrictive content filters, Deep Research is slow",
  },

  // Claude — 3 reviews
  {
    listingSlug: "claude",
    authorEmail: "daniel.engineer@example.com",
    authorName: "Daniel Park",
    rating: 5,
    title: "The best coding assistant I've used, period",
    body: "Claude 3.5 Sonnet has become my primary coding assistant and it's not close. The Artifacts feature for generating UI components, the nuanced understanding of complex codebases, and the 200K context window that lets me paste entire files — it's operating on a different level for software engineering tasks. It almost never refuses reasonable requests and its explanations are clear and thorough.",
    pros: "200K context window handles entire codebases, Artifacts for instant UI previews, rarely refuses reasonable tasks, excellent explanations",
    cons: "No real-time web access in standard interface, can be slower than GPT-4o on Pro for simple tasks",
  },
  {
    listingSlug: "claude",
    authorEmail: "sarah.writer@example.com",
    authorName: "Sarah Thompson",
    rating: 5,
    title: "Writes better than any AI I've tried",
    body: "I'm a professional writer and Claude's prose quality is in a different league. It maintains voice consistency, avoids clichés, and actually understands stylistic nuance. The 200K context window means I can paste my entire manuscript and ask for feedback. It's thoughtful about sensitive topics without being preachy. For any serious writing work, Claude is the clear choice.",
    pros: "Best prose quality of any AI, truly understands stylistic nuance, handles extremely long documents, thoughtful and honest responses",
    cons: "Projects feature needs polish, occasional tendency toward excessive caveats, no image generation built in",
  },
  {
    listingSlug: "claude",
    authorEmail: "mike.analyst@example.com",
    authorName: "Michael Torres",
    rating: 4,
    title: "Excellent for analysis and long documents",
    body: "I work in financial analysis and Claude has been transformative for processing long earnings reports, regulatory filings, and research papers. The ability to load a 200-page PDF and ask targeted questions is remarkable. Responses are measured and nuanced, which I appreciate in a professional context. My only hesitation is the API pricing adds up fast at scale compared to some alternatives.",
    pros: "Best-in-class at long document analysis, nuanced and balanced responses, excellent at structured data extraction",
    cons: "API pricing is steep for high-volume use, no real-time data access, Pro plan doesn't include priority access during peak hours",
  },

  // Midjourney — 2 reviews
  {
    listingSlug: "midjourney",
    authorEmail: "lisa.designer@example.com",
    authorName: "Lisa Nakamura",
    rating: 5,
    title: "Produces images that look like they were shot professionally",
    body: "I've been using Midjourney since V4 and the quality leap to V6.1 is staggering. For product photography mockups, editorial illustrations, and concept art, it consistently produces results I couldn't achieve with stock photography. The aesthetic quality has a signature look that's become the gold standard. Vary Region for targeted inpainting is incredibly useful. No other tool comes close for pure visual quality.",
    pros: "Best aesthetic quality of any AI image generator, Vary Region for targeted edits, consistent results with good prompts, huge prompt reference community",
    cons: "Discord-only for many features (web interface still limited), no truly free tier anymore, style consistency across multiple images requires effort",
  },
  {
    listingSlug: "midjourney",
    authorEmail: "tom.photo@example.com",
    authorName: "Tom Bradley",
    rating: 4,
    title: "Stunning results but steep learning curve",
    body: "Midjourney produces images that genuinely compete with professional photography and illustration. The outputs regularly make me go 'wow'. That said, it takes real investment to learn the prompt syntax, parameter flags, and aesthetic vocabulary to get consistent results. The lack of a true free trial makes it hard to recommend for casual users. Once you're past the learning curve though, it's an incredible creative tool.",
    pros: "Unmatched visual quality, huge creative range from photorealistic to painterly, excellent community resources",
    cons: "Steep learning curve, no meaningful free tier, web interface less capable than Discord version, text in images still imperfect",
  },

  // GitHub Copilot — 3 reviews
  {
    listingSlug: "github-copilot",
    authorEmail: "priya.dev@example.com",
    authorName: "Priya Sharma",
    rating: 5,
    title: "My hands literally type less code now",
    body: "GitHub Copilot has genuinely changed how I code. For boilerplate, test writing, and repetitive patterns, it completes entire functions before I finish the first line. The Copilot Chat integration in VS Code is excellent for explaining legacy code I've inherited. The ROI is obvious — I estimate I'm 30-40% faster on common tasks. At $10/month, it's the best value dev tool subscription I have.",
    pros: "Excellent at predicting multi-line completions, Chat is great for explaining code, massive time savings on boilerplate, great IDE integration",
    cons: "Sometimes suggests outdated API patterns, can be overconfident on security-sensitive code, needs guidance for complex architectural decisions",
  },
  {
    listingSlug: "github-copilot",
    authorEmail: "chris.backend@example.com",
    authorName: "Chris Adeyemi",
    rating: 4,
    title: "Solid autocomplete, Chat needs improvement",
    body: "Copilot's inline completion is genuinely impressive and I'd have a hard time coding without it now. The Chat feature is helpful but trails behind Claude and GPT-4o for complex reasoning about my codebase. I'd love context that spans my full repository rather than just open files. The recent GPT-4o model upgrade noticeably improved suggestion quality. Worth every penny for the autocomplete alone.",
    pros: "Best-in-class inline completion, natural language to code is reliable, free for students, strong TypeScript/Python support",
    cons: "Chat lacks full-codebase context (vs Cursor), sometimes suggests hallucinated APIs, can struggle with non-mainstream languages",
  },
  {
    listingSlug: "github-copilot",
    authorEmail: "elena.frontend@example.com",
    authorName: "Elena Kozlov",
    rating: 4,
    title: "Essential for frontend development",
    body: "As a frontend developer, Copilot is particularly brilliant for React components, CSS, and TypeScript types. It seems to have internalized every design pattern imaginable. I use it alongside Copilot Chat for debugging and the combination is powerful. I've tried Cursor and it offers deeper codebase context, but Copilot's lighter integration means less friction in my existing VS Code workflow.",
    pros: "Exceptional at React and TypeScript, component completion is magical, workspace integration feels native, good at CSS and Tailwind",
    cons: "Misses codebase-wide context that Cursor provides, occasional suggestions that introduce subtle bugs, test generation could be stronger",
  },

  // CrewAI — 2 reviews
  {
    listingSlug: "crewai",
    authorEmail: "raj.ai@example.com",
    authorName: "Raj Patel",
    rating: 5,
    title: "The best framework for building real-world agent workflows",
    body: "I've built production AI pipelines with AutoGen, LangChain, and CrewAI, and CrewAI is now my default. The role-based agent design maps naturally to how you'd structure a human team, making it intuitive to architect complex workflows. The sequential and hierarchical process modes cover 90% of use cases cleanly. The platform's observability tools are genuinely useful for debugging multi-agent runs in production.",
    pros: "Intuitive role-based architecture, excellent documentation, active community with many pre-built examples, good LLM provider flexibility",
    cons: "Can get expensive quickly with many frontier LLM calls, some edge cases in agent memory management, platform pricing not fully transparent",
  },
  {
    listingSlug: "crewai",
    authorEmail: "anna.nlp@example.com",
    authorName: "Anna Müller",
    rating: 4,
    title: "Powerful but requires careful prompt engineering",
    body: "CrewAI is impressive for orchestrating complex multi-step workflows that would be painful to build from scratch. The abstraction is clean and the resulting agent behavior is surprisingly coherent. My caution is that the quality of your output depends heavily on the quality of your role definitions and goal prompts — garbage in, garbage out. Once you invest time in designing good agent personas and tasks, the results are remarkable.",
    pros: "Clean abstractions for complex workflows, supports all major LLMs, good tool integration ecosystem, active development",
    cons: "Output quality is sensitive to agent prompt quality, debugging failed runs can be tedious, documentation occasionally lags behind releases",
  },

  // ElevenLabs — 2 reviews
  {
    listingSlug: "elevenlabs",
    authorEmail: "marcus.podcast@example.com",
    authorName: "Marcus Johnson",
    rating: 5,
    title: "Voice cloning that's indistinguishable from the real thing",
    body: "I use ElevenLabs for my podcast production and the quality is genuinely shocking. I cloned my own voice to generate pickup lines for episodes I've already recorded, and listeners can't tell the difference. The multilingual dubbing feature is a game-changer for reaching international audiences. The Turbo v2.5 model generates audio in near-real-time, which opens up possibilities for live applications.",
    pros: "Best voice quality of any TTS platform, voice cloning from short samples, 29 language support, real-time generation with Turbo model",
    cons: "Creator plan limits feel tight for heavy production use, voice cloning requires careful ethics consideration, some voices have occasional prosody quirks",
  },
  {
    listingSlug: "elevenlabs",
    authorEmail: "sophie.game@example.com",
    authorName: "Sophie Laurent",
    rating: 4,
    title: "Essential for indie game audio production",
    body: "As an indie game developer, ElevenLabs has replaced expensive voice actor contracts for NPC dialogue. The emotional range and naturalness make characters feel believable. The Projects feature for producing full audiobooks or game scripts is well-designed. My main frustration is the character limit on lower tiers — a mid-sized game has thousands of dialogue lines and the credit usage adds up fast.",
    pros: "Natural prosody, excellent emotional range, Projects feature streamlines long-form production, API is well-documented",
    cons: "Credit consumption for games is high, cloned voices can drift on very long outputs, some accents less natural than native voices",
  },

  // Cursor — 2 reviews
  {
    listingSlug: "cursor",
    authorEmail: "ben.fullstack@example.com",
    authorName: "Ben Williamson",
    rating: 5,
    title: "The editor that makes me feel like a 10x developer",
    body: "I switched from VS Code + Copilot to Cursor three months ago and the productivity jump is real. Cursor's Composer can plan and implement multi-file changes that would take me hours manually. The codebase-wide context means it can reference your API patterns, component conventions, and TypeScript types correctly. The ability to add documentation and GitHub issues as context is particularly powerful. It's not cheap but it's absolutely worth it.",
    pros: "Multi-file refactors via Composer, full codebase context for accurate suggestions, can reference docs and external URLs, feels like VS Code",
    cons: "Pro plan is $20/mo which adds up, performance can lag on very large repos, occasional over-engineering suggestions from the AI",
  },
  {
    listingSlug: "cursor",
    authorEmail: "yuki.startup@example.com",
    authorName: "Yuki Tanaka",
    rating: 5,
    title: "Transformed how our startup ships product",
    body: "At our early-stage startup, speed is everything. Cursor lets our two-person engineering team ship features that would have taken 3x as long before. The chat-with-codebase feature alone pays for itself — asking 'why is this component re-rendering?' and getting an accurate, codebase-aware answer in seconds is magic. We're all in on Cursor and have no plans to go back.",
    pros: "Dramatic speed improvement for small teams, outstanding context awareness, handles TypeScript/React extremely well, intuitive keyboard shortcuts",
    cons: "Privacy-conscious teams may have concerns about codebase indexing, occasionally suggests patterns inconsistent with existing code style",
  },

  // AutoGPT — 2 reviews
  {
    listingSlug: "autogpt",
    authorEmail: "leo.automation@example.com",
    authorName: "Leo Kim",
    rating: 4,
    title: "The platform has matured significantly from the early days",
    body: "AutoGPT started as a fascinating research demo and has evolved into a usable no-code agent builder. I've built agents for competitive monitoring, content summarization pipelines, and automated research briefings. The new platform UI is much more accessible than the original CLI. Reliability is still the Achilles' heel — agents still occasionally get stuck in unproductive loops, but the guardrails have improved considerably.",
    pros: "No-code interface is genuinely accessible, pre-built agent templates are useful starting points, active open-source community, historically significant project",
    cons: "Agents can still loop unproductively, complex tasks require careful goal specification, not yet as reliable as purpose-built tools like CrewAI",
  },
  {
    listingSlug: "autogpt",
    authorEmail: "cara.ops@example.com",
    authorName: "Cara Obi",
    rating: 3,
    title: "Great concept, reliability still needs work",
    body: "I've been following AutoGPT since its viral launch and appreciate what the project represents for the field. The platform version is a real improvement over the raw CLI. But for production use, I still find it too unpredictable — agents occasionally spin up unnecessary sub-tasks or fail to recognize task completion. For research and experimentation it's excellent. For mission-critical automation, I'd still lean toward more structured frameworks.",
    pros: "Pioneered the autonomous agent concept, improving platform quality, great for exploring agentic AI, large community for support",
    cons: "Reliability for production workflows is still behind CrewAI/LangGraph, agent loops require careful monitoring, goal specification is an art form",
  },
];

// ============================================================================
// Seed function
// ============================================================================

async function main() {
  console.log("🌱 Seeding AgentShelf database...");

  // ── Step 1: Upsert categories ────────────────────────────────────────────
  console.log("  → Upserting categories...");
  const categoryMap = new Map<string, string>(); // slug → id

  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
      },
    });
    categoryMap.set(cat.slug, category.id);
  }
  console.log(`     ✓ ${CATEGORIES.length} categories upserted`);

  // ── Step 2: Upsert listings ──────────────────────────────────────────────
  console.log("  → Upserting listings...");
  const listingMap = new Map<string, string>(); // slug → id

  for (const listing of LISTINGS) {
    const categoryId = categoryMap.get(listing.categorySlug);
    if (!categoryId) {
      throw new Error(`Category not found for slug: ${listing.categorySlug}`);
    }

    const { categorySlug, ...listingData } = listing;

    const created = await prisma.listing.upsert({
      where: { slug: listing.slug },
      update: {
        ...listingData,
        categoryId,
      },
      create: {
        ...listingData,
        categoryId,
      },
    });
    listingMap.set(listing.slug, created.id);
  }
  console.log(`     ✓ ${LISTINGS.length} listings upserted`);

  // ── Step 3: Upsert review authors ────────────────────────────────────────
  console.log("  → Upserting review authors...");
  const authorMap = new Map<string, string>(); // email → id

  const uniqueAuthors = Array.from(
    new Map(
      SEED_REVIEWS.map((r) => [r.authorEmail, { email: r.authorEmail, name: r.authorName }])
    ).values()
  );

  for (const author of uniqueAuthors) {
    const user = await prisma.user.upsert({
      where: { email: author.email },
      update: { name: author.name },
      create: {
        email: author.email,
        name: author.name,
      },
    });
    authorMap.set(author.email, user.id);
  }
  console.log(`     ✓ ${uniqueAuthors.length} review authors upserted`);

  // ── Step 4: Upsert reviews ───────────────────────────────────────────────
  console.log("  → Upserting reviews...");

  for (const review of SEED_REVIEWS) {
    const authorId = authorMap.get(review.authorEmail);
    const listingId = listingMap.get(review.listingSlug);

    if (!authorId || !listingId) {
      console.warn(`  ⚠ Skipping review: author or listing not found (${review.authorEmail} / ${review.listingSlug})`);
      continue;
    }

    await prisma.review.upsert({
      where: {
        authorId_listingId: {
          authorId,
          listingId,
        },
      },
      update: {
        rating: review.rating,
        title: review.title,
        body: review.body,
        pros: review.pros,
        cons: review.cons,
      },
      create: {
        rating: review.rating,
        title: review.title,
        body: review.body,
        pros: review.pros,
        cons: review.cons,
        authorId,
        listingId,
      },
    });
  }
  console.log(`     ✓ ${SEED_REVIEWS.length} reviews upserted`);

  // ── Step 5: Refresh aggregate stats ─────────────────────────────────────
  console.log("  → Refreshing listing review aggregates...");

  const slugsWithReviews = [...new Set(SEED_REVIEWS.map((r) => r.listingSlug))];

  for (const slug of slugsWithReviews) {
    const listingId = listingMap.get(slug);
    if (!listingId) continue;

    const aggregates = await prisma.review.aggregate({
      where: { listingId },
      _avg: { rating: true },
      _count: { id: true },
    });

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        avgRating: aggregates._avg.rating ?? 0,
        reviewCount: aggregates._count.id,
      },
    });
  }
  console.log(`     ✓ Aggregates refreshed for ${slugsWithReviews.length} listings`);

  console.log("\n✅ Seed complete!");
  console.log(`   ${CATEGORIES.length} categories`);
  console.log(`   ${LISTINGS.length} listings`);
  console.log(`   ${SEED_REVIEWS.length} reviews`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
