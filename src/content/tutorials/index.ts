export interface Tutorial {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  emoji: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  publishDate: string;
  author: string;
  relatedTools: string[];
  content: string;
}

export const TUTORIALS: Tutorial[] = [
  {
    slug: "chatgpt-api-getting-started",
    title: "Getting Started with the ChatGPT API",
    description: "Learn how to integrate OpenAI's ChatGPT API into your applications. Covers authentication, making API calls, handling responses, streaming, and cost management.",
    category: "API & Development",
    readTime: "12 min read",
    emoji: "🤖",
    difficulty: "Beginner",
    publishDate: "2025-01-15",
    author: "AgentShelf Team",
    relatedTools: ["chatgpt", "cursor", "github-copilot"],
    content: `
<h2>Why Use the ChatGPT API Instead of the Web Interface?</h2>
<p>The ChatGPT web interface is great for casual use, but the API unlocks a completely different tier of capability. With the API you can embed AI directly into your own applications, automate workflows, process thousands of documents, and build products that your users can interact with — all without them ever leaving your platform.</p>
<p>Compared to the web interface, the API gives you: programmatic control over every request, the ability to set system-level instructions, fine-grained access to different model versions, streaming output for better UX, and full visibility into token usage for cost management.</p>

<h2>Prerequisites</h2>
<ul>
  <li><strong>Node.js 18+</strong> or <strong>Python 3.8+</strong> installed on your machine</li>
  <li>An OpenAI account at <strong>platform.openai.com</strong></li>
  <li>A credit card added to your OpenAI account (required for API access)</li>
  <li>Basic familiarity with running terminal commands</li>
</ul>

<h2>Getting Your API Key</h2>
<p>Head to <strong>platform.openai.com</strong>, sign in, and click your profile icon in the top right. Select <strong>API Keys</strong> from the menu. Click <strong>Create new secret key</strong>, give it a name (e.g. "my-first-project"), and copy the key immediately — you won't be able to see it again.</p>
<p>Store your API key as an environment variable, never hardcode it in source files:</p>
<pre><code class="language-bash"># Linux / macOS
export OPENAI_API_KEY="sk-..."

# Windows (PowerShell)
$env:OPENAI_API_KEY = "sk-..."

# Or create a .env file (and add it to .gitignore!)
OPENAI_API_KEY=sk-...</code></pre>

<h2>Your First API Call</h2>
<p>Install the official library and make your first call:</p>
<pre><code class="language-bash"># Python
pip install openai

# Node.js
npm install openai</code></pre>

<h3>Python Example</h3>
<pre><code class="language-python">from openai import OpenAI

client = OpenAI()  # reads OPENAI_API_KEY from environment

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain what a REST API is in two sentences."}
    ]
)

print(response.choices[0].message.content)</code></pre>

<h3>JavaScript / Node.js Example</h3>
<pre><code class="language-javascript">import OpenAI from "openai";

const client = new OpenAI(); // reads OPENAI_API_KEY from environment

const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Explain what a REST API is in two sentences." }
  ],
});

console.log(response.choices[0].message.content);</code></pre>

<h2>Understanding the Response Object</h2>
<p>The API returns a rich response object. Here are the key fields you'll use:</p>
<ul>
  <li><strong>choices[0].message.content</strong> — the text of the AI's reply</li>
  <li><strong>choices[0].finish_reason</strong> — why the model stopped: <code>stop</code> (normal), <code>length</code> (hit max_tokens), <code>content_filter</code></li>
  <li><strong>usage.prompt_tokens</strong> — tokens used in your input (system + user messages)</li>
  <li><strong>usage.completion_tokens</strong> — tokens generated in the response</li>
  <li><strong>usage.total_tokens</strong> — sum of both; this is what you're billed for</li>
  <li><strong>model</strong> — the exact model version that processed the request</li>
</ul>

<h2>Chat History and Multi-Turn Conversations</h2>
<p>Unlike traditional stateless APIs, the ChatGPT API is also stateless — it doesn't remember previous requests. To create a conversation, you pass the entire chat history in every request. This is simple but requires you to manage the history yourself:</p>
<pre><code class="language-python">from openai import OpenAI

client = OpenAI()

conversation_history = [
    {"role": "system", "content": "You are a friendly coding tutor."}
]

def chat(user_message):
    conversation_history.append({"role": "user", "content": user_message})
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=conversation_history
    )
    
    assistant_message = response.choices[0].message.content
    conversation_history.append({"role": "assistant", "content": assistant_message})
    return assistant_message

print(chat("What is a for loop?"))
print(chat("Can you show me an example in Python?"))
print(chat("What about JavaScript?"))</code></pre>
<p>Notice that each call includes the full history, so the model knows the context of "What about JavaScript?" refers to for loops, not something new.</p>

<h2>Understanding Tokens and Pricing</h2>
<p>Tokens are chunks of text — roughly 4 characters or 0.75 words in English. "Hello, world!" is about 4 tokens. "The quick brown fox jumps over the lazy dog" is about 10 tokens.</p>
<p>OpenAI charges separately for input tokens (your messages) and output tokens (the model's reply). Output tokens are more expensive because generating text is more compute-intensive than reading it.</p>
<p>As of 2025, approximate pricing:</p>
<ul>
  <li><strong>GPT-4o</strong>: $5 per 1M input tokens, $15 per 1M output tokens</li>
  <li><strong>GPT-4o mini</strong>: $0.15 per 1M input tokens, $0.60 per 1M output tokens</li>
  <li><strong>GPT-3.5 Turbo</strong>: $0.50 per 1M input tokens, $1.50 per 1M output tokens</li>
</ul>
<p>For most tasks, <strong>GPT-4o mini is the sweet spot</strong> — it's 33x cheaper than GPT-4o and surprisingly capable for structured tasks, summarization, and classification.</p>

<h2>Streaming Responses</h2>
<p>For any user-facing application, streaming dramatically improves perceived performance — text appears token by token rather than the user waiting for the full response:</p>
<pre><code class="language-python">from openai import OpenAI

client = OpenAI()

stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Write a haiku about Python programming."}],
    stream=True,
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()  # newline at end</code></pre>

<h2>Building a Simple Chatbot</h2>
<p>Here's a complete command-line chatbot you can run right now:</p>
<pre><code class="language-python">from openai import OpenAI

client = OpenAI()

def run_chatbot():
    print("ChatBot ready! Type 'quit' to exit.")
    print("-" * 40)
    
    messages = [
        {"role": "system", "content": (
            "You are a helpful assistant. Be concise and friendly. "
            "If you don't know something, say so."
        )}
    ]
    
    while True:
        user_input = input("You: ").strip()
        if not user_input:
            continue
        if user_input.lower() in ("quit", "exit", "bye"):
            print("Goodbye!")
            break
        
        messages.append({"role": "user", "content": user_input})
        
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                max_tokens=500,
                temperature=0.7,
            )
            reply = response.choices[0].message.content
            messages.append({"role": "assistant", "content": reply})
            print(f"Assistant: {reply}")
            print(f"(Tokens used: {response.usage.total_tokens})")
        except Exception as e:
            print(f"Error: {e}")
            messages.pop()  # remove the failed user message

if __name__ == "__main__":
    run_chatbot()</code></pre>

<h2>Best Practices</h2>
<h3>Error Handling</h3>
<p>Always wrap API calls in try/except blocks. Common errors: <code>RateLimitError</code> (too many requests), <code>AuthenticationError</code> (bad API key), <code>APIConnectionError</code> (network issues). Use exponential backoff for retries.</p>
<h3>Rate Limits</h3>
<p>Free tier accounts have very low rate limits. Paid accounts have higher limits. Check your limits in the OpenAI dashboard under <strong>Limits</strong>. If you hit limits in production, implement a queue.</p>
<h3>Cost Management</h3>
<ul>
  <li>Set <strong>max_tokens</strong> to cap response length and prevent runaway costs</li>
  <li>Use <strong>GPT-4o mini</strong> for tasks that don't require GPT-4o quality</li>
  <li>Trim conversation history when it gets long (keep the last N turns)</li>
  <li>Set spending limits in the OpenAI dashboard</li>
</ul>

<h2>Next Steps</h2>
<p>Now that you have the basics down, explore: function calling (structured JSON outputs), the Assistants API (built-in thread management), fine-tuning for domain-specific tasks, and the vision API for image understanding. The OpenAI cookbook on GitHub has hundreds of working examples for real-world use cases.</p>
`,
  },
  {
    slug: "crewai-agents-guide",
    title: "Building AI Agents with CrewAI",
    description: "Learn to build multi-agent AI systems using CrewAI. Create specialized agents, define tasks, and orchestrate complex workflows that run autonomously.",
    category: "AI Agents",
    readTime: "18 min read",
    emoji: "🕵️",
    difficulty: "Intermediate",
    publishDate: "2025-01-22",
    author: "AgentShelf Team",
    relatedTools: ["crewai", "langchain", "autogpt"],
    content: `
<h2>What Are AI Agents — and Why Multi-Agent Systems?</h2>
<p>An AI agent is an LLM that can take actions: searching the web, reading files, writing code, calling APIs. Unlike a single prompt-response, agents can plan a sequence of steps, use tools, observe results, and adjust their approach until a goal is achieved.</p>
<p>Multi-agent systems take this further by assigning <em>specialized roles</em> to different agents. Just as a company has a researcher, a writer, and an editor — each expert in their domain — a CrewAI crew has agents with defined personas, goals, and tool access. The agents collaborate, passing outputs between them, to produce results no single agent could achieve alone.</p>
<p>Common patterns: a <strong>Researcher</strong> gathers information → a <strong>Analyst</strong> synthesizes it → a <strong>Writer</strong> drafts the output → a <strong>Reviewer</strong> checks quality. CrewAI makes this orchestration simple.</p>

<h2>Installing CrewAI</h2>
<pre><code class="language-bash">pip install crewai crewai-tools

# Verify installation
python -c "import crewai; print(crewai.__version__)"</code></pre>
<p>You'll also need an OpenAI API key (or you can configure CrewAI to use other LLM providers like Anthropic, Groq, or local Ollama models):</p>
<pre><code class="language-bash">export OPENAI_API_KEY="sk-..."</code></pre>

<h2>Core Concepts</h2>
<ul>
  <li><strong>Agent</strong>: An LLM with a role, goal, backstory, and optional tools. The backstory shapes its behavior — "You are a meticulous fact-checker who never assumes..." produces very different behavior than a generic agent.</li>
  <li><strong>Task</strong>: A specific unit of work assigned to an agent. Has a description, expected output, and optionally an output file or structured output format.</li>
  <li><strong>Crew</strong>: The orchestrator that manages multiple agents and tasks. Supports sequential (one after another) and hierarchical (manager delegates to workers) processes.</li>
  <li><strong>Tools</strong>: Functions agents can call — web search, file operations, code execution, API calls. CrewAI ships with many built-in tools.</li>
</ul>

<h2>Creating Your First Agent: The Researcher</h2>
<pre><code class="language-python">from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool

# Tool for web search (requires SERPER_API_KEY env var, free tier available)
search_tool = SerperDevTool()

researcher = Agent(
    role="Senior Research Analyst",
    goal="Uncover cutting-edge developments in AI and summarize them accurately",
    backstory=(
        "You are a veteran technology researcher with 15 years of experience. "
        "You're known for your ability to cut through hype and identify what's "
        "genuinely important. You always verify claims with multiple sources."
    ),
    tools=[search_tool],
    verbose=True,          # logs agent's thinking
    allow_delegation=False, # this agent won't delegate to others
    llm="gpt-4o",          # you can specify per-agent LLMs
)</code></pre>

<h2>Creating a Second Agent: The Writer</h2>
<pre><code class="language-python">writer = Agent(
    role="Tech Content Writer",
    goal=(
        "Create engaging, accurate articles that make complex AI topics "
        "accessible to a general tech audience"
    ),
    backstory=(
        "You are an experienced technology journalist who has written for "
        "publications like Wired and MIT Technology Review. You translate "
        "technical findings into compelling narratives without dumbing them down."
    ),
    tools=[],  # writer doesn't need search tools
    verbose=True,
    allow_delegation=False,
    llm="gpt-4o",
)</code></pre>

<h2>Defining Tasks</h2>
<pre><code class="language-python">research_task = Task(
    description=(
        "Research the latest developments in AI agents published in the last 30 days. "
        "Focus on: new frameworks, benchmark results, and real-world deployments. "
        "Identify the 3 most significant developments and explain why each matters."
    ),
    expected_output=(
        "A structured report with 3 sections, each covering one major development. "
        "Include: what it is, why it matters, and a direct source URL."
    ),
    agent=researcher,
    output_file="research_report.md",  # saves output to file
)

write_task = Task(
    description=(
        "Using the research report provided, write a 600-word blog article "
        "titled 'This Week in AI Agents'. Maintain an informative but conversational tone. "
        "Include an intro, one section per development, and a conclusion with your take."
    ),
    expected_output=(
        "A complete, publication-ready blog article in markdown format. "
        "The article should flow naturally and not feel like a list of facts."
    ),
    agent=writer,
    context=[research_task],  # tells CrewAI this task depends on research_task's output
    output_file="blog_article.md",
)</code></pre>

<h2>Assembling and Running the Crew</h2>
<pre><code class="language-python">crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,  # tasks run in order
    verbose=True,
)

result = crew.kickoff()
print("=== FINAL OUTPUT ===")
print(result)</code></pre>
<p>When you run this, you'll see each agent's thinking process in the terminal — what they search for, what they find, how they formulate their output. CrewAI handles the orchestration so you don't need to manually pass outputs between agents.</p>

<h2>Using Tools</h2>
<p>CrewAI provides many built-in tools. Here are the most useful:</p>
<pre><code class="language-python">from crewai_tools import (
    SerperDevTool,        # web search via Serper API
    FileReadTool,         # read local files
    FileWriterTool,       # write files
    DirectoryReadTool,    # list directory contents
    WebsiteSearchTool,    # search a specific website
    PDFSearchTool,        # RAG over PDF files
    CodeInterpreterTool,  # execute Python code
)

# Give an agent multiple tools
data_analyst = Agent(
    role="Data Analyst",
    goal="Analyze data files and produce insights",
    backstory="Expert data analyst who codes in Python",
    tools=[FileReadTool(), FileWriterTool(), CodeInterpreterTool()],
)</code></pre>

<h2>Debugging and Monitoring Your Crew</h2>
<p>Set <code>verbose=True</code> on both agents and the crew to see the full thought process. In production, CrewAI integrates with <strong>Agentops</strong> for observability — add <code>agentops.init()</code> before your crew runs to get a dashboard with timings, token usage, and full trace logs.</p>
<p>Common debugging tips:</p>
<ul>
  <li>If an agent loops without progress, check that its tools are returning useful data</li>
  <li>If output quality is low, strengthen the <code>backstory</code> and <code>expected_output</code> fields</li>
  <li>Use <code>Process.hierarchical</code> with a manager LLM for complex workflows where a manager agent should coordinate workers</li>
</ul>

<h2>Real Use Cases</h2>
<h3>Content Pipeline</h3>
<p>Researcher → Outline Writer → Article Writer → SEO Reviewer → Editor. Each agent specializes. The crew produces a complete, SEO-optimized article from a single topic keyword input.</p>
<h3>Research Automation</h3>
<p>Provide a list of companies. A Researcher agent searches each one, a Data Extractor pulls specific fields (revenue, headcount, funding), and a Report Writer formats a comparison table.</p>
<h3>Code Review Crew</h3>
<p>Feed a pull request diff. A Security Auditor checks for vulnerabilities, a Performance Analyst looks for bottlenecks, and a Code Quality Reviewer checks style — each files their findings, which a Summary Agent consolidates into a final review comment.</p>

<h2>Limitations and Best Practices</h2>
<ul>
  <li><strong>Costs add up fast</strong>: Multi-agent systems make many LLM calls. Always test with GPT-4o mini before switching to GPT-4o</li>
  <li><strong>Non-determinism</strong>: Agents don't always produce the same output. Build workflows that are tolerant of variation</li>
  <li><strong>Long tasks need checkpoints</strong>: Use <code>output_file</code> on intermediate tasks so you can resume from a checkpoint if something fails</li>
  <li><strong>Avoid circular dependencies</strong>: Tasks should have a clear dependency order; circular task dependencies will cause infinite loops</li>
  <li>Keep backstories focused and specific — vague backstories lead to generic outputs</li>
</ul>
`,
  },
  {
    slug: "prompt-engineering-101",
    title: "Prompt Engineering 101",
    description: "Master the art of writing effective prompts. Learn chain-of-thought, few-shot prompting, role assignment, and output formatting techniques with real before/after examples.",
    category: "Prompting",
    readTime: "10 min read",
    emoji: "✍️",
    difficulty: "Beginner",
    publishDate: "2025-02-01",
    author: "AgentShelf Team",
    relatedTools: ["chatgpt", "claude", "perplexity-ai"],
    content: `
<h2>Why Prompt Engineering Matters</h2>
<p>The same AI model can produce a vague, unhelpful response or a precise, actionable answer — the only difference is how you ask. Prompt engineering is the practice of structuring your input to reliably get the output you need. It's not magic; it's communication design applied to language models.</p>
<p>Good prompts can eliminate 80% of the back-and-forth you'd otherwise spend refining AI outputs. For developers building on LLM APIs, better prompts mean fewer tokens, lower costs, and more predictable outputs.</p>

<h2>The Anatomy of a Good Prompt</h2>
<p>Every effective prompt has up to five components. You don't always need all five, but knowing each one helps:</p>
<ul>
  <li><strong>Role</strong>: Who should the AI be? ("You are a senior financial analyst...")</li>
  <li><strong>Context</strong>: What background information does it need? ("I'm building a B2B SaaS for HR teams...")</li>
  <li><strong>Task</strong>: What exactly should it do? ("Write a 3-paragraph executive summary...")</li>
  <li><strong>Format</strong>: How should the output be structured? ("Respond in JSON with keys: title, summary, action_items")</li>
  <li><strong>Constraints</strong>: What limits apply? ("Under 200 words, no technical jargon, written for a C-suite audience")</li>
</ul>

<h2>Technique 1: Chain-of-Thought Prompting</h2>
<p>For any task requiring reasoning, logic, or multi-step calculation, appending <em>"Let's think step by step"</em> (or asking the model to reason before answering) dramatically improves accuracy.</p>
<p><strong>Without chain-of-thought:</strong></p>
<pre><code class="language-text">Prompt: "If a store sells 3 items at $4.50 each and gives a 15% discount, what's the total?"
Response: "$11.47" (often wrong)</code></pre>
<p><strong>With chain-of-thought:</strong></p>
<pre><code class="language-text">Prompt: "If a store sells 3 items at $4.50 each and gives a 15% discount, what's the total? Think step by step."
Response: "3 items × $4.50 = $13.50. Discount: $13.50 × 0.15 = $2.025. Total: $13.50 - $2.025 = $11.48."</code></pre>
<p>Chain-of-thought works because it forces the model to generate intermediate reasoning tokens before the answer, reducing the chance of the model "jumping" to a wrong conclusion.</p>

<h2>Technique 2: Few-Shot Prompting</h2>
<p>Show 2–3 examples of the input/output pattern you want before giving the actual request. This is especially powerful for consistent formatting, tone matching, and domain-specific outputs.</p>
<pre><code class="language-text">Classify the sentiment of product reviews as Positive, Negative, or Neutral.

Review: "Arrived on time, exactly as described."
Sentiment: Positive

Review: "The zipper broke after two uses. Very disappointed."
Sentiment: Negative

Review: "It's okay. Does what it says."
Sentiment: Neutral

Review: "Absolutely love it, already ordered a second one!"
Sentiment:</code></pre>
<p>The model now has a crystal-clear pattern. Without examples, it might return "The sentiment is positive" — with examples, it returns exactly "Positive".</p>

<h2>Technique 3: Role Assignment</h2>
<p>Assigning a specific expert persona produces more authoritative, domain-appropriate responses.</p>
<p><strong>Generic:</strong> "Explain how to improve my website's SEO."</p>
<p><strong>With role:</strong> "You are an SEO consultant with 10 years of experience specializing in e-commerce sites. Explain the three highest-impact changes I can make to improve my product pages' search rankings."</p>
<p>The role doesn't just change tone — it shifts the model toward vocabulary, frameworks, and recommendations appropriate for that domain.</p>

<h2>Technique 4: Output Format Control</h2>
<p>Be explicit about the format you want. LLMs are highly responsive to format instructions.</p>
<ul>
  <li><strong>JSON</strong>: "Respond with a JSON object. Fields: name (string), tags (array of strings), priority (1-5 integer)"</li>
  <li><strong>Markdown table</strong>: "Format the comparison as a markdown table with columns: Feature, Tool A, Tool B"</li>
  <li><strong>Numbered list</strong>: "Give me exactly 5 recommendations, numbered, each under 30 words"</li>
  <li><strong>XML/structured tags</strong>: "Wrap your response in &lt;analysis&gt; and &lt;recommendation&gt; tags"</li>
</ul>
<p>When building applications, always request JSON output and use <code>response_format: { type: "json_object" }</code> (OpenAI) to enforce it at the API level.</p>

<h2>Technique 5: Constraint Setting</h2>
<p>Constraints focus the model and prevent it from padding responses with filler. Common constraints:</p>
<ul>
  <li>Word/character limits: "In exactly 50 words..."</li>
  <li>Audience level: "Explain as if to a 12-year-old" or "Assume the reader is a PhD in machine learning"</li>
  <li>Tone: "Use a formal, professional tone" / "Keep it conversational and friendly"</li>
  <li>Scope: "Focus only on open-source solutions" / "Only consider options under $100/month"</li>
  <li>What to exclude: "Do not include caveats or disclaimers"</li>
</ul>

<h2>Before/After Examples</h2>
<h3>Scenario 1: Writing a bio</h3>
<p><strong>Bad:</strong> "Write a bio for me."</p>
<p><strong>Good:</strong> "Write a 3-sentence professional bio for a product manager with 5 years of experience at SaaS startups. Tone: confident but approachable. Do not use the word 'passionate'."</p>

<h3>Scenario 2: Code review</h3>
<p><strong>Bad:</strong> "Review this code."</p>
<p><strong>Good:</strong> "You are a senior Python developer. Review the following function for: (1) correctness, (2) edge cases not handled, (3) performance issues. Format as a numbered list. Be specific — point to line numbers."</p>

<h3>Scenario 3: Email drafting</h3>
<p><strong>Bad:</strong> "Write an email to a client about a delay."</p>
<p><strong>Good:</strong> "Draft a professional email to a B2B client informing them their project delivery will be delayed by 2 weeks due to unexpected technical issues. Acknowledge the inconvenience, explain briefly without over-detailing, offer a specific revised date, and include a small gesture of goodwill. Keep it under 150 words."</p>

<h3>Scenario 4: Data extraction</h3>
<p><strong>Bad:</strong> "Extract the key info from this job posting."</p>
<p><strong>Good:</strong> "Extract structured data from this job posting. Return JSON with: title, company, location (remote/hybrid/onsite), salary_range (null if not listed), required_years_experience, top_5_required_skills (array)."</p>

<h3>Scenario 5: Summarization</h3>
<p><strong>Bad:</strong> "Summarize this article."</p>
<p><strong>Good:</strong> "Summarize this article in 3 bullet points, each under 20 words. Focus on: the core finding, the method used, and the practical implication. Avoid jargon."</p>

<h2>Common Mistakes to Avoid</h2>
<ul>
  <li><strong>Being too vague</strong>: "Help me with marketing" gives the model no direction. Always specify the task.</li>
  <li><strong>Asking for too much at once</strong>: Break complex requests into sequential prompts or use chain-of-thought</li>
  <li><strong>Assuming context</strong>: The model doesn't know your industry, audience, or goals unless you tell it</li>
  <li><strong>Ignoring negative instructions</strong>: "Don't include..." works, but "Focus only on..." is usually more reliable</li>
  <li><strong>Not specifying format</strong>: If you need structured data, always specify the exact format</li>
</ul>

<h2>Prompt Chaining for Complex Tasks</h2>
<p>For tasks too complex for a single prompt, break them into a chain. Each output becomes the input for the next step:</p>
<ol>
  <li>Prompt 1: "Given this brief, generate 10 potential blog post angles."</li>
  <li>Prompt 2: "From these 10 angles, pick the 3 most likely to perform well for SEO and explain why."</li>
  <li>Prompt 3: "Write a full outline for angle #2."</li>
  <li>Prompt 4: "Write the full article from this outline."</li>
</ol>

<h2>Quick Reference Cheat Sheet</h2>
<ul>
  <li>Add role: <em>"You are an expert [role]..."</em></li>
  <li>Force reasoning: <em>"Think step by step before answering."</em></li>
  <li>Get JSON: <em>"Respond only with a JSON object. No prose."</em></li>
  <li>Consistent format: Provide 2–3 examples before your request</li>
  <li>Constrain length: <em>"In exactly N words / bullet points / sentences"</em></li>
  <li>Audience: <em>"Explain to [specific audience]"</em></li>
  <li>Verify: Add <em>"If you are unsure, say so."</em> to reduce hallucinations</li>
</ul>
`,
  },
  {
    slug: "midjourney-guide",
    title: "How to Use Midjourney: Complete Beginner's Guide",
    description: "Everything you need to start generating stunning images with Midjourney. Covers setup, parameters, prompt formulas, and techniques for photorealism, illustration, and concept art.",
    category: "Image Generation",
    readTime: "14 min read",
    emoji: "🎨",
    difficulty: "Beginner",
    publishDate: "2025-02-10",
    author: "AgentShelf Team",
    relatedTools: ["midjourney", "dall-e-3", "stable-diffusion"],
    content: `
<h2>What Is Midjourney — and Why Is It Different?</h2>
<p>Midjourney is an AI image generation model accessible through Discord. Unlike DALL-E (web-based) or Stable Diffusion (local install), Midjourney runs entirely in a Discord server, which is unusual but has advantages: a thriving community, instant access to others' prompts for inspiration, and no local GPU required.</p>
<p>Midjourney consistently produces the most <em>aesthetically polished</em> images of any AI image generator — particularly strong at photorealism, painterly illustration, and cinematic compositing. It tends to be preferred by professionals for client work, marketing assets, and concept art.</p>

<h2>Getting Started on Discord</h2>
<ol>
  <li>Create a Discord account at discord.com if you don't have one</li>
  <li>Go to <strong>midjourney.com</strong> and click "Join the Beta" — this invites you to the Midjourney Discord server</li>
  <li>Subscribe to a plan at <strong>midjourney.com/account</strong>. The Basic plan ($10/month) gives ~200 image generations. The Standard plan ($30/month) gives unlimited "relaxed" generations</li>
  <li>Once subscribed, you can use Midjourney in any Discord server where the bot is installed, or in direct messages with the bot</li>
  <li>To DM the bot: find <strong>Midjourney Bot</strong> in the member list and send it a message</li>
</ol>

<h2>The /imagine Command: Basic Syntax</h2>
<p>Every image starts with <code>/imagine</code> followed by a text prompt:</p>
<pre><code class="language-text">/imagine a red fox sitting in a snowy forest, golden hour light, photorealistic</code></pre>
<p>Midjourney generates 4 image variations by default. Below the grid you'll see buttons:</p>
<ul>
  <li><strong>U1–U4</strong>: Upscale a specific image (higher resolution, more detail)</li>
  <li><strong>V1–V4</strong>: Create 4 variations of a specific image (similar but not identical)</li>
  <li><strong>🔄</strong>: Regenerate — run the same prompt again for new variations</li>
</ul>

<h2>Aspect Ratios: --ar</h2>
<p>By default Midjourney generates square (1:1) images. Change this with <code>--ar</code>:</p>
<ul>
  <li><code>--ar 16:9</code> — landscape, great for YouTube thumbnails, desktop wallpapers, hero images</li>
  <li><code>--ar 9:16</code> — portrait, perfect for Instagram Stories, TikTok, phone wallpapers</li>
  <li><code>--ar 4:3</code> — classic photo ratio</li>
  <li><code>--ar 2:3</code> — portrait photography, book covers</li>
  <li><code>--ar 1:1</code> — square, best for social media posts, logos</li>
</ul>
<pre><code class="language-text">/imagine aerial view of Tokyo at night, neon lights, rain --ar 16:9</code></pre>

<h2>Stylize Parameter: --stylize (or --s)</h2>
<p>Controls how much Midjourney's aesthetic training influences the image. Range: 0–1000. Default: 100.</p>
<ul>
  <li><strong>--stylize 0</strong>: Follows your prompt very literally, minimal AI "artistic interpretation"</li>
  <li><strong>--stylize 100</strong>: Default balance of prompt accuracy and aesthetic quality</li>
  <li><strong>--stylize 750</strong>: More artistic, more opinionated, may deviate from prompt</li>
  <li><strong>--stylize 1000</strong>: Maximum artistic freedom — beautiful but may ignore parts of your prompt</li>
</ul>

<h2>Style Raw: --style raw</h2>
<p>Adding <code>--style raw</code> reduces Midjourney's tendency to add its signature polished look. This is useful when you want:</p>
<ul>
  <li>More photorealistic images without the "Midjourney look"</li>
  <li>Images that match real-world photography more closely</li>
  <li>Less over-saturated, less stylized outputs</li>
</ul>
<pre><code class="language-text">/imagine portrait of a woman, natural window light, Canon 5D, 85mm lens --style raw --ar 2:3</code></pre>

<h2>Version Parameter: --v</h2>
<p>Always use the latest version for best results. As of 2025, that's <code>--v 6.1</code>. You can set a default version in <code>/settings</code> so you don't have to add it every time.</p>

<h2>Quality Parameter: --q</h2>
<p><code>--q 2</code> doubles the rendering time but produces more detailed images. <code>--q .5</code> is faster and cheaper. For final outputs, use <code>--q 2</code>. For quick exploration, use the default or <code>--q .5</code>.</p>

<h2>Negative Prompting: --no</h2>
<p>Tell Midjourney what to exclude from the image:</p>
<pre><code class="language-text">/imagine a mountain landscape, dramatic sky --no people, cars, buildings, text</code></pre>
<p>Common uses: <code>--no text, watermarks</code> (remove unwanted text), <code>--no blurry, out of focus</code> (force sharpness), <code>--no cartoon, illustration</code> (force photorealism).</p>

<h2>5 Example Prompts with Expected Results</h2>

<h3>1. Cinematic Photorealism</h3>
<pre><code class="language-text">/imagine close-up portrait of an elderly fisherman, weathered face, deep-set eyes, fog in background, shot on Leica M11, 50mm Summilux, golden hour --ar 2:3 --style raw --stylize 200</code></pre>
<p><em>Produces a hyper-realistic portrait with filmic quality, deep texture in skin, and moody atmosphere.</em></p>

<h3>2. Fantasy Concept Art</h3>
<pre><code class="language-text">/imagine ancient library built inside a giant tree, glowing bookshelves spiraling upward, shafts of magical light, detailed illustration, Artstation trending --ar 16:9 --stylize 750</code></pre>
<p><em>Produces richly detailed fantasy concept art with warm lighting and intricate architectural detail.</em></p>

<h3>3. Product Photography</h3>
<pre><code class="language-text">/imagine luxury minimalist perfume bottle, dark background, single dramatic light source, reflections on surface, commercial product photography --ar 1:1 --style raw --q 2</code></pre>
<p><em>Clean, professional product shot suitable for use in marketing materials.</em></p>

<h3>4. Flat Illustration</h3>
<pre><code class="language-text">/imagine isometric city illustration, pastel colors, tiny detailed buildings and streets, flat design style, clean background --ar 1:1 --stylize 300 --no shadows, gradients</code></pre>
<p><em>Produces a vector-style isometric illustration with consistent colors — great for app icons, blog headers.</em></p>

<h3>5. Abstract Art</h3>
<pre><code class="language-text">/imagine fluid ink in water, deep blue and gold, macro photography, swirling patterns, high contrast, abstract --ar 16:9 --stylize 900 --q 2</code></pre>
<p><em>Produces mesmerizing abstract imagery with fine detail throughout.</em></p>

<h2>Prompt Structure Formula</h2>
<p>This formula reliably produces good results:</p>
<pre><code class="language-text">[Subject], [Setting/Background], [Mood/Lighting], [Style/Medium], [Camera/Technical], [Parameters]</code></pre>
<p>Example applying the formula:</p>
<pre><code class="language-text">a corgi wearing a tiny hat [subject], sitting on a wooden stool in a sunlit kitchen [setting], warm afternoon light, cheerful [mood/lighting], watercolor illustration [style], --ar 4:3 --stylize 400</code></pre>

<h2>Common Beginner Mistakes</h2>
<ul>
  <li><strong>Too many concepts</strong>: "a dragon flying over a futuristic city at sunset with cherry blossoms and a samurai fighting robots" — Midjourney will try to include everything and the result is chaotic. Focus on 2–3 key elements.</li>
  <li><strong>No style direction</strong>: Saying "a dog" gives you a random style. Add "photorealistic", "oil painting", "anime illustration", or "3D render" to control the aesthetic.</li>
  <li><strong>Ignoring --ar</strong>: Most compositions look much better with appropriate aspect ratios. Portraits need tall ratios; landscapes need wide ones.</li>
  <li><strong>Not upscaling</strong>: The initial 2x2 grid is low resolution. Always upscale (U button) the image you want to use.</li>
  <li><strong>Over-relying on "realistic"</strong>: Use specific technical language instead — "shot on Canon EOS R5, 85mm f/1.4, shallow depth of field" is far more effective than just "realistic".</li>
</ul>
`,
  },
  {
    slug: "langchain-rag-guide",
    title: "Building RAG Applications with LangChain",
    description: "Build production-ready Retrieval-Augmented Generation applications. Learn to load documents, create embeddings, set up vector stores, and build a complete chat-with-your-documents system.",
    category: "API & Development",
    readTime: "20 min read",
    emoji: "🔗",
    difficulty: "Advanced",
    publishDate: "2025-02-18",
    author: "AgentShelf Team",
    relatedTools: ["langchain", "chatgpt", "perplexity-ai"],
    content: `
<h2>What Is RAG — and Why Does It Matter?</h2>
<p>Large language models have a fundamental limitation: they only know what was in their training data. If you ask GPT-4 about your company's internal policies, last week's earnings call, or a newly published research paper, it either hallucinates an answer or admits it doesn't know.</p>
<p><strong>Retrieval-Augmented Generation (RAG)</strong> solves this. Instead of relying solely on the model's training, RAG retrieves relevant documents from a knowledge base and provides them as context in the prompt. The model then generates answers <em>grounded in your data</em>. This approach is now the standard architecture for enterprise AI assistants, document Q&A systems, and custom knowledge bases.</p>

<h2>The RAG Pipeline</h2>
<p>RAG has two phases:</p>
<p><strong>Indexing (one-time setup):</strong></p>
<ol>
  <li><strong>Load</strong>: Read documents (PDFs, Word files, web pages, databases)</li>
  <li><strong>Split</strong>: Break documents into smaller chunks (500–1000 tokens each)</li>
  <li><strong>Embed</strong>: Convert each chunk to a vector (numerical representation of meaning)</li>
  <li><strong>Store</strong>: Save vectors in a vector database (ChromaDB, Pinecone, Weaviate)</li>
</ol>
<p><strong>Querying (at runtime):</strong></p>
<ol>
  <li><strong>Embed query</strong>: Convert the user's question to a vector</li>
  <li><strong>Retrieve</strong>: Find the top-k most similar document chunks</li>
  <li><strong>Generate</strong>: Send retrieved chunks + question to the LLM for a grounded answer</li>
</ol>

<h2>Setup</h2>
<pre><code class="language-bash">pip install langchain langchain-openai langchain-community chromadb pypdf tiktoken

export OPENAI_API_KEY="sk-..."</code></pre>

<h2>Step 1: Loading Documents</h2>
<p>LangChain provides DocumentLoaders for almost every file format:</p>
<pre><code class="language-python">from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    WebBaseLoader,
    DirectoryLoader,
    UnstructuredWordDocumentLoader,
)

# Load a PDF
loader = PyPDFLoader("company_handbook.pdf")
documents = loader.load()
print(f"Loaded {len(documents)} pages")

# Load all PDFs in a folder
loader = DirectoryLoader("./docs/", glob="*.pdf", loader_cls=PyPDFLoader)
documents = loader.load()

# Load a web page
loader = WebBaseLoader("https://example.com/article")
documents = loader.load()

# Each document has: page_content (str) and metadata (dict with source, page, etc.)
print(documents[0].page_content[:200])
print(documents[0].metadata)</code></pre>

<h2>Step 2: Text Splitting</h2>
<p>Raw documents are too large to fit in a single prompt. We split them into overlapping chunks. The overlap (typically 10–20% of chunk size) ensures context isn't lost at chunk boundaries:</p>
<pre><code class="language-python">from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,      # target chunk size in characters
    chunk_overlap=200,    # overlap between chunks
    length_function=len,
    separators=["\n\n", "\n", " ", ""]  # split on paragraphs first, then lines, etc.
)

chunks = splitter.split_documents(documents)
print(f"Split into {len(chunks)} chunks")
print(f"Sample chunk: {chunks[0].page_content[:300]}")</code></pre>
<p><strong>Chunk size tips:</strong> For dense technical documents, use smaller chunks (500–700 chars). For narrative text, larger chunks (1000–1500 chars) preserve more context. Always tune for your specific use case.</p>

<h2>Step 3: Creating Embeddings</h2>
<p>Embeddings transform text into high-dimensional vectors that encode semantic meaning. Similar concepts have similar vectors, enabling similarity search.</p>
<pre><code class="language-python">from langchain_openai import OpenAIEmbeddings

# OpenAI's text-embedding-3-small is cheap and good for most use cases
# text-embedding-3-large is higher quality but 5x more expensive
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Test: embed a single string
vector = embeddings.embed_query("What is the vacation policy?")
print(f"Vector dimension: {len(vector)}")  # 1536 for text-embedding-3-small</code></pre>
<p>For open-source embeddings (no API cost), use <code>HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")</code> — nearly as good for English text.</p>

<h2>Step 4: Vector Store with ChromaDB</h2>
<pre><code class="language-python">from langchain_community.vectorstores import Chroma

# Create vector store and embed all chunks (this takes a minute for large documents)
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db",  # saves to disk so you don't re-embed every run
)

# Next time, load the existing store:
# vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)

# Test retrieval
query = "What is the company's remote work policy?"
results = vectorstore.similarity_search(query, k=4)
for i, doc in enumerate(results):
    print(f"Result {i+1}: {doc.page_content[:200]}")
    print(f"Source: {doc.metadata}")</code></pre>

<h2>Step 5: Building the Retrieval Chain</h2>
<pre><code class="language-python">from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# Create a retriever from the vector store
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4}  # retrieve top 4 chunks
)

# Custom prompt that encourages grounded answers
prompt_template = """You are a helpful assistant answering questions based on the provided context.
Use only the information in the context to answer. If the answer isn't in the context, say "I don't have that information in the provided documents."

Context:
{context}

Question: {question}

Answer:"""

PROMPT = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "question"]
)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",  # "stuff" puts all retrieved docs in one prompt
    retriever=retriever,
    chain_type_kwargs={"prompt": PROMPT},
    return_source_documents=True,
)

# Ask a question
result = qa_chain.invoke({"query": "What is the vacation policy?"})
print(result["result"])
print("\nSources:")
for doc in result["source_documents"]:
    print(f"  - {doc.metadata.get('source', 'Unknown')}, page {doc.metadata.get('page', '?')}")</code></pre>

<h2>Complete Working Application</h2>
<p>Here's a full "chat with your documents" app combining everything above:</p>
<pre><code class="language-python">from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
import os

def build_rag_app(docs_dir: str, db_dir: str = "./chroma_db"):
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    
    if os.path.exists(db_dir) and os.listdir(db_dir):
        print("Loading existing vector store...")
        vectorstore = Chroma(persist_directory=db_dir, embedding_function=embeddings)
    else:
        print("Building vector store from documents...")
        loader = DirectoryLoader(docs_dir, glob="*.pdf", loader_cls=PyPDFLoader)
        documents = loader.load()
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.split_documents(documents)
        vectorstore = Chroma.from_documents(chunks, embeddings, persist_directory=db_dir)
        print(f"Indexed {len(chunks)} chunks from {len(documents)} pages")
    
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, streaming=True)
    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        output_key="answer"
    )
    
    chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(search_kwargs={"k": 4}),
        memory=memory,
        return_source_documents=True,
    )
    return chain

def main():
    chain = build_rag_app("./documents")
    print("Document Q&A ready! Type 'quit' to exit.\n")
    
    while True:
        question = input("You: ").strip()
        if question.lower() in ("quit", "exit"):
            break
        result = chain.invoke({"question": question})
        print(f"Assistant: {result['answer']}")
        sources = set(d.metadata.get("source", "") for d in result.get("source_documents", []))
        if sources:
            print(f"(Sources: {', '.join(sources)})\n")

if __name__ == "__main__":
    main()</code></pre>

<h2>Evaluating RAG Quality</h2>
<p>Measure your RAG system with three metrics:</p>
<ul>
  <li><strong>Faithfulness</strong>: Does the answer only use information from retrieved chunks? (Prevents hallucination)</li>
  <li><strong>Answer relevance</strong>: Does the answer address the question asked?</li>
  <li><strong>Context relevance</strong>: Are the retrieved chunks actually relevant to the question?</li>
</ul>
<p>Use the <strong>RAGAS</strong> library (<code>pip install ragas</code>) to automate evaluation with these metrics using a small test set of question-answer pairs.</p>

<h2>Common Problems and Solutions</h2>
<ul>
  <li><strong>Hallucinations</strong>: Add "Only answer from the context. If uncertain, say so." to your prompt. Lower temperature to 0.</li>
  <li><strong>Irrelevant retrieval</strong>: Try a different chunk size, use metadata filtering, or switch to hybrid search (keyword + semantic)</li>
  <li><strong>Context window overflow</strong>: Reduce k (number of retrieved chunks) or use a model with larger context window</li>
  <li><strong>Slow indexing</strong>: Use batch embedding, process documents offline, cache results to disk</li>
</ul>

<h2>Production Considerations</h2>
<ul>
  <li>Use <strong>Pinecone</strong> or <strong>Weaviate</strong> instead of ChromaDB for production (managed, scalable, persistent)</li>
  <li>Add document metadata (date, author, section) to enable filtered retrieval</li>
  <li>Implement a re-ranking step (Cohere rerank API) to improve retrieval quality</li>
  <li>Cache embedding calls — re-embedding the same text is wasteful</li>
  <li>Monitor retrieval quality in production with periodic spot checks</li>
</ul>
`,
  },
  {
    slug: "ai-tools-content-creators",
    title: "The Complete AI Toolkit for Content Creators",
    description: "A practical guide to integrating AI tools into your content creation workflow — from writing and image generation to video production, audio, and repurposing content at scale.",
    category: "Tools & Workflows",
    readTime: "11 min read",
    emoji: "🎬",
    difficulty: "Beginner",
    publishDate: "2025-03-01",
    author: "AgentShelf Team",
    relatedTools: ["midjourney", "runway-ml", "elevenlabs", "suno-ai", "copy-ai"],
    content: `
<h2>How AI Has Changed Content Creation</h2>
<p>Two years ago, a solo creator competing with a team of 10 was nearly impossible. Today, AI has compressed the production gap significantly. A single person can now research, write, design, produce, and publish content at a quality and volume that previously required a full team. The creators thriving in 2025 aren't replacing themselves with AI — they're acting as creative directors, with AI handling the execution layer.</p>
<p>The shift is not about using AI for everything. It's about knowing <em>which parts of your workflow</em> AI can accelerate without degrading the authenticity that builds your audience. This guide breaks down the AI stack by content type.</p>

<h2>Writing: Scripts, Captions, Blog Posts</h2>
<p><strong>ChatGPT / Claude</strong> are the workhorses for writing. The key is treating them as collaborators, not ghostwriters. Feed them your raw thoughts, bullet points, or transcript and ask them to structure and polish — rather than generating content from scratch, which tends to sound generic.</p>
<p>Best use cases:</p>
<ul>
  <li><strong>YouTube scripts</strong>: "Here are my talking points for a video about [topic]. Write a 1200-word script with a hook, three main sections, and a CTA. Match this tone: [paste 3 sentences of your own writing]."</li>
  <li><strong>Captions</strong>: "Write 5 Instagram caption variations for this photo of [description]. Vary the tone: one informative, one humorous, one inspirational. Include relevant hashtags in a comment-style block."</li>
  <li><strong>Blog outlines</strong>: Generate a detailed H2/H3 outline, then fill in each section yourself — you get structure without losing your voice.</li>
</ul>
<p><strong>Copy.ai</strong> is purpose-built for marketing copy and includes templates for product descriptions, email sequences, ad copy, and social posts. It's faster than ChatGPT for templated tasks but less flexible for freeform writing.</p>

<h2>Image Generation: Thumbnails, Graphics, Concepts</h2>
<p><strong>Midjourney</strong> is the gold standard for creating custom visuals. For YouTube thumbnails, use this workflow:</p>
<ol>
  <li>Generate the background/concept image in Midjourney (use <code>--ar 16:9</code>)</li>
  <li>Import into <strong>Canva</strong> or Photoshop</li>
  <li>Add your face (photograph, not AI-generated — audiences connect with real faces), text overlay, and brand elements</li>
</ol>
<p><strong>Canva AI</strong> (Magic Studio) is excellent for non-designers who need graphics quickly. It can generate custom illustrations, remove backgrounds, expand images, and generate text-to-image directly within the Canva design environment. For most social media graphics, Canva AI is faster than Midjourney because the output is immediately editable.</p>
<p><strong>Adobe Firefly</strong> is worth using for stock-safe image generation — it's trained on licensed content, so outputs are safe for commercial use without copyright concerns.</p>

<h2>Video: Generation, Editing, Enhancement</h2>
<p><strong>Runway ML</strong> (Gen-3 Alpha) leads for AI video generation. You can generate 10-second video clips from text prompts or extend/animate still images. Current realistic use cases: b-roll footage, abstract visual content, lo-fi aesthetic clips. It's not yet reliable enough for narrative video with consistent characters.</p>
<p><strong>Descript</strong> is the most practical AI video tool for most creators. It transcribes your video, lets you edit the video by editing the transcript (delete a paragraph, the video cut is made automatically), removes filler words in one click, and includes a voice clone feature so you can fix mis-spoken lines without re-recording.</p>
<p><strong>Kapwing</strong> is strong for automated subtitle generation, translations (auto-translate to 70+ languages), and clip creation from longer videos.</p>

<h2>Audio: Voiceover and Music</h2>
<p><strong>ElevenLabs</strong> produces the most realistic AI voices available. Use cases: voiceovers for educational content, narration for faceless channels, multilingual versions of your content using your own cloned voice. The voice cloning feature requires only a few minutes of audio to create a convincing replica. Monthly cost: $5–$22 depending on character usage.</p>
<p><strong>Suno AI</strong> generates full songs (vocals, instruments, mixing) from a text prompt in seconds. "Upbeat lo-fi hip hop with piano, perfect for studying" produces a complete track you can use as background music. Currently, Suno music is copyright-free for paid plans, making it useful for YouTube content where licensed music triggers Content ID.</p>
<p><strong>Adobe Podcast</strong> (free) uses AI to remove background noise and enhance audio quality from any recording — a huge time saver if you don't have a professional recording setup.</p>

<h2>Repurposing: One Video → Many Assets</h2>
<p>The highest-ROI AI workflow for content creators is repurposing. Record one long-form piece and let AI multiply it:</p>
<ul>
  <li><strong>Opus Clip</strong>: Analyzes a long video and automatically cuts the most engaging 60-second clips, adds captions, and formats for TikTok/Reels/Shorts</li>
  <li><strong>Descript</strong>: Generate a transcript → paste into ChatGPT → "Turn this transcript into a 1500-word blog post"</li>
  <li><strong>Castmagic</strong>: Upload a podcast/video → get transcript, show notes, social posts, email newsletter, and quote cards automatically</li>
</ul>

<h2>Workflow Example: Idea to Published YouTube Video</h2>
<ol>
  <li><strong>Research</strong> (15 min): Use Perplexity AI to research your topic and gather current facts and sources</li>
  <li><strong>Script</strong> (20 min): Paste research into ChatGPT with your talking points → draft script → edit in your voice</li>
  <li><strong>Thumbnail</strong> (10 min): Generate background in Midjourney → assemble in Canva with your photo and text</li>
  <li><strong>Record & Edit</strong> (1–2 hrs): Film your video, import to Descript, edit via transcript, remove filler words</li>
  <li><strong>Repurpose</strong> (5 min): Run through Opus Clip for shorts, Castmagic for description/timestamps/newsletter</li>
</ol>

<h2>Cost Breakdown</h2>
<table>
  <thead><tr><th>Tool</th><th>Monthly Cost</th><th>Primary Use</th></tr></thead>
  <tbody>
    <tr><td>ChatGPT Plus</td><td>$20</td><td>Writing, research</td></tr>
    <tr><td>Midjourney Standard</td><td>$30</td><td>Thumbnails, graphics</td></tr>
    <tr><td>ElevenLabs Starter</td><td>$5</td><td>Voiceover</td></tr>
    <tr><td>Descript Creator</td><td>$24</td><td>Video editing</td></tr>
    <tr><td>Opus Clip Pro</td><td>$29</td><td>Repurposing clips</td></tr>
    <tr><td>Suno Pro</td><td>$8</td><td>Background music</td></tr>
    <tr><td><strong>Total</strong></td><td><strong>~$116/month</strong></td><td>Full AI content stack</td></tr>
  </tbody>
</table>
<p>For creators just starting, prioritize ChatGPT Plus + Descript — those two tools alone transform a solo creator's output capacity. Add others as you scale.</p>

<h2>Maintaining Your Authentic Voice</h2>
<ul>
  <li>Always provide examples of your own writing when prompting AI to write in your style</li>
  <li>Edit AI drafts aggressively — rewrite opening lines and conclusions in your own words</li>
  <li>Use AI for structure and research; write the memorable one-liners yourself</li>
  <li>Record video in your own words — use scripts as talking points, not teleprompter text</li>
</ul>

<h2>Tools to Approach with Caution</h2>
<ul>
  <li><strong>Full AI article generators</strong>: Jasper, Writesonic, etc. — output tends to be generic and SEO-unfriendly; requires heavy editing to be usable</li>
  <li><strong>AI avatar video tools</strong>: HeyGen, Synthesia — useful for L&D/corporate content, but audiences quickly detect inauthenticity for personal brand content</li>
  <li><strong>AI music with unclear licensing</strong>: Always verify commercial use rights before publishing</li>
</ul>
`,
  },
  {
    slug: "understanding-llm-pricing",
    title: "Understanding LLM Pricing: A Complete Guide",
    description: "Demystify LLM pricing with a clear explanation of tokens, a full model comparison table, cost estimation formulas, and practical optimization strategies.",
    category: "Business & Strategy",
    readTime: "9 min read",
    emoji: "💰",
    difficulty: "Beginner",
    publishDate: "2025-03-10",
    author: "AgentShelf Team",
    relatedTools: ["chatgpt", "claude", "perplexity-ai"],
    content: `
<h2>How LLM Pricing Works: Tokens Explained Simply</h2>
<p>Every major LLM API charges by the <strong>token</strong>. A token is a small unit of text — not exactly a word, not exactly a character, but somewhere in between. A helpful rule of thumb: <strong>1 token ≈ 4 characters ≈ 0.75 words</strong> in English.</p>
<p>In practice: "Hello, world!" is about 4 tokens. A typical email is 100–300 tokens. A 1,000-word blog post is roughly 1,300 tokens. A long legal document might be 10,000+ tokens.</p>
<p>Why don't they just charge per word? Tokenization is how LLMs actually process text internally — each token represents a chunk the model has assigned a vector to. Words like "unbelievable" might be split into ["un", "believ", "able"] = 3 tokens. Short common words like "the" or "is" are usually 1 token each.</p>

<h2>Input vs Output Tokens</h2>
<p>All API providers charge separately for <strong>input tokens</strong> (your prompt, system message, and any context you provide) and <strong>output tokens</strong> (the model's response). Output tokens cost more — typically 3–5x more than input tokens. This is because generating tokens is computationally more intensive than processing them.</p>
<p>Key implication: <strong>long responses are expensive</strong>. If your use case allows shorter outputs (classification, extraction, summarization with word limits), you'll save significant money compared to applications requiring long-form generation.</p>

<h2>Context Window: Why It Matters for Cost</h2>
<p>The context window is the maximum number of tokens a model can process in a single API call (input + output combined). Larger context windows let you provide more background information, longer documents, or more conversation history.</p>
<p>But every token in the context window costs money — even if it's just background instructions the model "ignores." A 200,000-token context window doesn't mean you should fill it up every request. Only include what's necessary for the task.</p>

<h2>Model Pricing Comparison (2025)</h2>
<table>
  <thead>
    <tr>
      <th>Provider</th>
      <th>Model</th>
      <th>Input (per 1M tokens)</th>
      <th>Output (per 1M tokens)</th>
      <th>Context Window</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>OpenAI</td><td>GPT-4o</td><td>$5.00</td><td>$15.00</td><td>128K</td></tr>
    <tr><td>OpenAI</td><td>GPT-4o mini</td><td>$0.15</td><td>$0.60</td><td>128K</td></tr>
    <tr><td>OpenAI</td><td>o1</td><td>$15.00</td><td>$60.00</td><td>200K</td></tr>
    <tr><td>Anthropic</td><td>Claude 3.5 Sonnet</td><td>$3.00</td><td>$15.00</td><td>200K</td></tr>
    <tr><td>Anthropic</td><td>Claude 3 Haiku</td><td>$0.25</td><td>$1.25</td><td>200K</td></tr>
    <tr><td>Google</td><td>Gemini 1.5 Pro</td><td>$3.50</td><td>$10.50</td><td>2M</td></tr>
    <tr><td>Google</td><td>Gemini 1.5 Flash</td><td>$0.075</td><td>$0.30</td><td>1M</td></tr>
    <tr><td>Mistral</td><td>Mistral Large</td><td>$4.00</td><td>$12.00</td><td>128K</td></tr>
    <tr><td>Mistral</td><td>Mistral Small</td><td>$0.20</td><td>$0.60</td><td>32K</td></tr>
    <tr><td>Open source</td><td>Llama 3 (self-hosted)</td><td>~$0.10</td><td>~$0.10</td><td>128K</td></tr>
  </tbody>
</table>
<p><em>Note: Prices change frequently. Always verify at the provider's pricing page before building a budget.</em></p>

<h2>Estimating Costs: Formula and Examples</h2>
<p>The basic formula:</p>
<pre><code class="language-text">Cost = (input_tokens / 1,000,000 × input_price) + (output_tokens / 1,000,000 × output_price)</code></pre>

<h3>Example 1: Customer Support Bot (1,000 queries/day)</h3>
<p>Assumptions: 500-token system prompt + 100-token user question = 600 input tokens per query. 200-token average response.</p>
<pre><code class="language-text">Using GPT-4o mini ($0.15 input, $0.60 output):
Daily input:  1,000 × 600 = 600,000 tokens → $0.09
Daily output: 1,000 × 200 = 200,000 tokens → $0.12
Daily total: $0.21 → ~$6.30/month

Using GPT-4o ($5.00 input, $15.00 output):
Daily input:  600,000 tokens → $3.00
Daily output: 200,000 tokens → $3.00
Daily total: $6.00 → ~$180/month</code></pre>
<p>For this use case, GPT-4o mini is 28x cheaper. If quality is acceptable (it usually is for FAQ-style support), the cost difference is enormous at scale.</p>

<h3>Example 2: Blog Post Generation (10,000 posts/month)</h3>
<p>Assumptions: 200-token prompt + 100-token outline = 300 input tokens. 1,300-token output (1,000-word post).</p>
<pre><code class="language-text">Using GPT-4o mini:
Input:  10,000 × 300 = 3M tokens → $0.45
Output: 10,000 × 1,300 = 13M tokens → $7.80
Total: ~$8.25/month for 10,000 blog posts</code></pre>
<p>This is remarkably cheap. Even at GPT-4o pricing, 10,000 blog posts would cost ~$210/month — less than hiring a single contractor.</p>

<h2>When to Use Which Model</h2>
<ul>
  <li><strong>GPT-4o mini / Gemini Flash / Claude Haiku</strong>: Classification, extraction, summarization, simple Q&A, content moderation. Use these by default — upgrade only if quality is insufficient.</li>
  <li><strong>GPT-4o / Claude 3.5 Sonnet</strong>: Complex reasoning, nuanced writing, code generation, multi-step analysis. Worth the price when quality materially matters.</li>
  <li><strong>o1 / o1-mini</strong>: Math, logic puzzles, complex coding problems requiring deep reasoning. 3–12x more expensive; only use when the reasoning capability is genuinely needed.</li>
  <li><strong>Gemini 1.5 Pro</strong>: Best for tasks requiring large context (processing entire codebases, long legal documents, book-length analysis). Its 2M token window is unmatched.</li>
  <li><strong>Self-hosted Llama 3</strong>: When you need data privacy, predictable costs at massive scale, or can't send data to external APIs. Requires GPU infrastructure but cost-per-token approaches zero at high volume.</li>
</ul>

<h2>Free Tiers and How to Use Them</h2>
<ul>
  <li><strong>OpenAI</strong>: New accounts get $5 in free credits. Not much for production, but enough for building and testing.</li>
  <li><strong>Google AI Studio</strong>: Gemini 1.5 Flash is free with rate limits (15 RPM, 1M tokens/minute). Excellent for prototyping and low-traffic applications.</li>
  <li><strong>Anthropic</strong>: No ongoing free tier, but offers $5 credits on signup.</li>
  <li><strong>Groq</strong>: Free tier runs Llama 3 and Mixtral at extreme speed (800+ tokens/second). Ideal for latency-sensitive prototypes.</li>
  <li><strong>Ollama</strong>: Run Llama 3, Mistral, and others locally for free. No rate limits, no data leaving your machine.</li>
</ul>

<h2>Cost Optimization Strategies</h2>
<h3>1. Prompt Caching</h3>
<p>Both Anthropic and OpenAI offer prompt caching — if you send the same system prompt repeatedly, cached tokens cost 90% less. For applications with a large, static system prompt, this can cut costs dramatically.</p>

<h3>2. Batching (OpenAI Batch API)</h3>
<p>The OpenAI Batch API processes requests asynchronously within 24 hours at 50% off list price. For non-real-time tasks (content generation, data enrichment, bulk classification), batching is a straightforward 50% discount.</p>

<h3>3. Prompt Compression</h3>
<p>Remove redundant instructions, whitespace, and verbose context from your system prompts. Tools like LLMLingua can compress prompts by 3–10x with minimal quality loss by removing less important tokens.</p>

<h3>4. Model Routing</h3>
<p>Use a cheap model to classify query complexity, then route simple queries to the cheap model and complex ones to the expensive model. This "model router" pattern can reduce costs by 60–80% while maintaining quality where it matters.</p>

<h3>5. Output Length Control</h3>
<p>Always set <code>max_tokens</code>. Use <code>stop</code> sequences to end generation early when the answer is complete. Instruct the model explicitly: "Be concise. Answer in under 100 words." Output tokens are expensive — don't generate more than you need.</p>
`,
  },
  {
    slug: "automating-workflows-ai",
    title: "Automating Workflows with AI Tools",
    description: "Build AI-powered automations using Zapier, Make, and n8n. Learn three complete workflow examples: email summarization, support ticket routing, and daily news digests.",
    category: "Automation",
    readTime: "13 min read",
    emoji: "⚡",
    difficulty: "Intermediate",
    publishDate: "2025-03-20",
    author: "AgentShelf Team",
    relatedTools: ["zapier-ai", "make", "n8n"],
    content: `
<h2>Why AI Automation Is Different from Traditional Automation</h2>
<p>Traditional automation is deterministic: "if email contains 'invoice', move to folder." It breaks the moment the email says "bill" instead of "invoice." AI automation is <em>probabilistic</em>: it understands intent, handles variations in language, and makes judgment calls the way a human assistant would.</p>
<p>This changes what's possible to automate. Tasks that previously required human judgment — classifying customer sentiment, extracting structured data from unstructured text, summarizing variable-length documents, generating personalized responses — can now be automated reliably.</p>
<p>The practical result: AI automation handles the 80% of repetitive cognitive work that traditional rules-based automation never could.</p>

<h2>The Three Layers of AI Automation</h2>
<ol>
  <li><strong>Trigger</strong>: An event that starts the workflow — new email, form submission, scheduled time, webhook from another app, new row in a spreadsheet</li>
  <li><strong>AI Processing</strong>: The intelligent step — summarize, classify, extract, generate, translate, or transform the data using an LLM</li>
  <li><strong>Action</strong>: What happens with the result — create a Notion page, send a Slack message, route a ticket, update a CRM record, send an email</li>
</ol>
<p>The AI processing layer is where Zapier AI, Make, and n8n add their value — they provide native integrations with AI models (usually OpenAI, but often configurable) as workflow steps you can chain with hundreds of other apps.</p>

<h2>Tool Comparison: Zapier vs Make vs n8n</h2>
<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Zapier</th>
      <th>Make</th>
      <th>n8n</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Ease of use</td><td>⭐⭐⭐⭐⭐ Easiest</td><td>⭐⭐⭐⭐ Visual builder</td><td>⭐⭐⭐ Developer-friendly</td></tr>
    <tr><td>Pricing</td><td>$20–$69/mo (5 AI Zaps free)</td><td>$9–$29/mo (generous free tier)</td><td>Free (self-hosted) / $20/mo cloud</td></tr>
    <tr><td>App integrations</td><td>7,000+ apps</td><td>1,500+ apps</td><td>400+ nodes (extensible)</td></tr>
    <tr><td>AI capabilities</td><td>Native ChatGPT step, AI Actions</td><td>OpenAI, Claude modules</td><td>Full LangChain, any API</td></tr>
    <tr><td>Data privacy</td><td>Cloud only</td><td>Cloud only</td><td>Self-hostable (your server)</td></tr>
    <tr><td>Complex logic</td><td>Limited branching</td><td>Advanced scenarios</td><td>Full code + complex logic</td></tr>
    <tr><td>Best for</td><td>Non-technical users</td><td>Power users, cost-sensitive</td><td>Developers, privacy-critical</td></tr>
  </tbody>
</table>

<h2>Use Case 1: Email Summarization → Notion</h2>
<p><strong>Problem:</strong> You receive 20–30 important emails daily that need to be logged in Notion with a summary and action items extracted.</p>
<p><strong>Tools:</strong> Gmail + Zapier AI + Notion</p>
<h3>Building in Zapier:</h3>
<ol>
  <li><strong>Trigger</strong>: Gmail → "New Email" (filter: label = "To Process" or from specific senders)</li>
  <li><strong>AI Step</strong>: Zapier AI → "Summarize Email"
    <ul>
      <li>Prompt: <em>"Summarize this email in 2-3 sentences. Then extract any action items as a bulleted list. Format: Summary: [text]\n\nAction Items:\n- [item 1]\n- [item 2]"</em></li>
      <li>Input: map the email body field</li>
    </ul>
  </li>
  <li><strong>Action</strong>: Notion → "Create Page"
    <ul>
      <li>Database: your "Email Log" database</li>
      <li>Title: map the email subject line</li>
      <li>Body: map the AI summary output</li>
      <li>Properties: Date (today), Sender (from email), Status (New)</li>
    </ul>
  </li>
</ol>
<p>Result: Every email you label creates a structured Notion entry in under 10 seconds, with a summary and action items pre-extracted.</p>

<h2>Use Case 2: Auto-Classifying Support Tickets</h2>
<p><strong>Problem:</strong> Customer support tickets arrive via Typeform and need to be routed to the correct team (Technical, Billing, General) and prioritized (High/Medium/Low).</p>
<p><strong>Tools:</strong> Typeform + Make + OpenAI + Slack/Zendesk</p>
<h3>Building in Make:</h3>
<ol>
  <li><strong>Trigger</strong>: Typeform → "Watch Responses" (fires when a new form is submitted)</li>
  <li><strong>OpenAI Module</strong>: "Create a Completion"
    <ul>
      <li>System message: <em>"You are a customer support classifier. Always respond with valid JSON only."</em></li>
      <li>User message: <em>"Classify this support ticket. Return JSON: {'{'}"category": "Technical|Billing|General", "priority": "High|Medium|Low", "summary": "one sentence summary"{'}'}\n\nTicket: [form response]"</em></li>
    </ul>
  </li>
  <li><strong>JSON Parse Module</strong>: Parse the OpenAI JSON response into separate fields</li>
  <li><strong>Router Module</strong>: Branch based on category
    <ul>
      <li>Technical → create Zendesk ticket, assign to Tech team, post in #tech-support Slack channel</li>
      <li>Billing → create Zendesk ticket, assign to Billing team</li>
      <li>General → add to general support queue</li>
    </ul>
  </li>
  <li><strong>High Priority Filter</strong>: If priority = "High", additionally send an alert to team lead via Slack DM</li>
</ol>
<p>This workflow handles 100% of incoming tickets automatically, routing them correctly in seconds — without any human reading and sorting.</p>

<h2>Use Case 3: Daily News Digest</h2>
<p><strong>Problem:</strong> You want a daily email with summaries of the top AI news from 5 RSS feeds, delivered at 7am.</p>
<p><strong>Tools:</strong> n8n (self-hosted or cloud) + RSS + OpenAI + Email</p>
<pre><code class="language-javascript">// n8n Workflow (simplified as pseudocode)

// 1. Schedule Trigger: every day at 7:00 AM

// 2. RSS Feed nodes (run in parallel):
//    - https://feeds.feedburner.com/oreilly/radar
//    - https://openai.com/news/rss.xml
//    - https://www.theverge.com/ai-artificial-intelligence/rss/index.xml

// 3. Merge node: combine all articles from all feeds

// 4. Filter: only articles published in the last 24 hours

// 5. Loop: for each article
//    - OpenAI node: "Summarize this article in 2 sentences. Focus on why it matters for AI practitioners."
//    - Collect: title, URL, summary

// 6. OpenAI node (aggregate): 
//    Input: all collected summaries
//    Prompt: "Format these AI news items as a clean HTML email digest. 
//             Group by topic if possible. Lead with the most important story. 
//             Include article titles as links."

// 7. Send Email node: Send to your email address</code></pre>
<p>In n8n's visual builder, this workflow is around 8 nodes. Because n8n can be self-hosted, your RSS data and email content never leave your infrastructure.</p>

<h2>Building Your First Automation: A Beginner Path</h2>
<p>If you're new to automation, start with Zapier and this simple workflow:</p>
<ol>
  <li>Connect Gmail and Notion to your Zapier account</li>
  <li>Create a new Zap: Gmail → filter for a specific label → OpenAI step → Notion</li>
  <li>Use Zapier's pre-built "Summarize Email" AI action (no prompt engineering needed)</li>
  <li>Map the output to a Notion page</li>
  <li>Test with a real email, check the result, refine the prompt</li>
</ol>
<p>Start simple. One working automation that you use daily is worth more than ten complex ones that you set up and forget.</p>

<h2>Common Automation Patterns</h2>
<ul>
  <li><strong>Summarize</strong>: Long text → concise summary (emails, articles, meeting transcripts, PDF documents)</li>
  <li><strong>Classify</strong>: Unstructured text → category label (support tickets, feedback, leads by intent)</li>
  <li><strong>Extract</strong>: Raw text → structured fields (invoice data → spreadsheet, job postings → database, emails → CRM fields)</li>
  <li><strong>Generate</strong>: Brief + context → full text (product descriptions, email replies, meeting agendas)</li>
  <li><strong>Translate</strong>: Source language → target language (support responses, content localization)</li>
  <li><strong>Score</strong>: Input → numerical rating (lead scoring, content quality, sentiment 1–10)</li>
</ul>

<h2>Avoiding Common Pitfalls</h2>
<ul>
  <li><strong>Hallucinations in production</strong>: Always validate AI output for critical workflows. For classification tasks, ask the model to return a confidence score and route low-confidence outputs to human review.</li>
  <li><strong>Rate limits</strong>: OpenAI has rate limits per minute. Add delay nodes between API calls in batch workflows. Use a queue for high-volume automations.</li>
  <li><strong>Cost control</strong>: Set up OpenAI spending alerts. Test with GPT-4o mini — only upgrade to GPT-4o if quality is genuinely insufficient.</li>
  <li><strong>Fragile prompts</strong>: Always ask for JSON output and parse it. Free-form text outputs require additional parsing logic that breaks when format changes.</li>
  <li><strong>No error handling</strong>: Add error notification steps. If the API call fails, you want a Slack alert, not silent failure.</li>
</ul>

<h2>When NOT to Automate with AI</h2>
<ul>
  <li><strong>High-stakes decisions</strong>: Firing employees, approving large payments, medical decisions — keep humans in the loop</li>
  <li><strong>Low-volume, high-variability tasks</strong>: If you only do something once a week and each instance is unique, automation ROI is low</li>
  <li><strong>Tasks requiring real-time knowledge</strong>: LLMs have knowledge cutoffs. Don't automate anything that requires knowing today's specific news or live data without a retrieval step</li>
  <li><strong>Legally sensitive outputs</strong>: Legal documents, medical advice, financial recommendations — AI output needs human review before acting on it</li>
</ul>

<h2>Next Steps</h2>
<p>Once you have one automation running reliably, identify the next highest-volume repetitive task in your workflow. Map the trigger → AI processing → action pattern, then build it. Most teams find 3–5 well-designed AI automations eliminate the equivalent of one part-time role's worth of repetitive work within the first month.</p>
`,
  },
];
