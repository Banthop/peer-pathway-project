import { ArrowLeft, BookOpen, Lock } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useBuyerAuth } from "@/contexts/BuyerAuthContext";

export default function ColdEmailGuide() {
  const { buyerStatus } = useBuyerAuth();

  // Non-bundle users get redirected to the upgrade page
  if (buyerStatus && !buyerStatus.hasGuide) {
    const upgradeUrl = buyerStatus.tier === "recording"
      ? "/portal/upgrade?from=guide&plan=guide-upgrade"
      : "/portal/upgrade?from=guide&plan=bundle";
    return <Navigate to={upgradeUrl} replace />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111] selection:bg-emerald-200 pb-24" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>

      {/* ════════ STICKY HEADER ════════ */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E8E8E8] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/portal/resources"
            className="p-2 -ml-2 rounded-lg text-[#666] hover:bg-[#F5F5F5] hover:text-[#111] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-4 w-[1px] bg-[#E8E8E8]" />
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span className="text-[13px] font-semibold text-[#333]">The Cold Email System</span>
          </div>
        </div>
        <Link
          to="/portal/book-uthman"
          className="text-[12px] font-bold text-white bg-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-700 transition no-underline"
        >
          Book 1-on-1 Review
        </Link>
      </div>

      {/* ════════ MAIN CONTENT ════════ */}
      <div className="max-w-[800px] mx-auto px-5 md:px-6 pt-16">

        {/* ═══ TITLE ═══ */}
        <h1 className="text-[46px] font-[800] text-[#111] mb-8 pb-4 border-b-2 border-[#eaeaea] leading-[1.2] tracking-[-1px]">
          The Early Edge Cold Email System
        </h1>

        {/* ═══ WELCOME ═══ */}
        <h3 className="text-[24px] font-[700] text-[#222] mt-12 mb-5 leading-[1.3]">Welcome!</h3>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">
          This document is designed to provide an in-depth analysis of what we discuss in the Webinar, without overloading your eyes with text. We recommend listening to the Webinar first and then using this in conjunction with it to really familiarise yourself with the content.
        </p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">
          Anything explained briefly on the webinar will be here in detail for you to understand. If you wish to know how to do specifics, like using mailmerge or exporting leads from Apollo, these are covered in the webinar via diagrams and live walkthroughs, which is recorded.
        </p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">
          Still Confused? Drop Uthman an email at u5636199@live.warwick.ac.uk or connect with him on LinkedIn.
        </p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">
          <strong className="font-[700]">Congratulations. You've just made one of the best moves of your uni life.</strong><br />
          You decided to back yourself and learn a skill that actually gets you noticed.
        </p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">
          Follow this properly, and you <strong className="font-[700]">WILL</strong> land a summer internship. Even as a first-year. Even without experience. Even if you don't know anyone in finance yet.
        </p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">
          Cold emailing <strong className="font-[700]">works</strong>. Not overnight, but if you stick with it, you'll get replies, build real relationships, and open doors most students never even see.
        </p>

        <hr className="border-0 border-t-2 border-[#eaeaea] my-20" />

        {/* ═══ WHERE THIS COURSE CAME FROM ═══ */}
        <h2 className="text-[32px] font-[800] text-[#111] mt-14 mb-6 leading-[1.3] tracking-[-0.5px]">Where This Course Came From</h2>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">We built this because we were tired of watching smart students miss out just because they didn't have connections.</p>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">We started testing cold emails ourselves, sending messages to analysts, partners, and founders. We saw what worked and what didn't. Then we helped other students try it. We refined, tested again, and improved every part of it.</p>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Finally, we built this course together with <strong className="font-[700]">Don</strong>, our cofounder and cold email specialist. Before Early Edge, Don ran his own lead generation business, using cold outreach to connect with founders, land clients, and even help those clients win more deals.</p>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">So when he helped design this course, he added the exact systems and strategies he'd developed and tested over years of real outreach. These are the same frameworks that helped him get replies from hard-to-reach people, build trust quickly, and cut hours off the boring parts.</p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">This isn't theory. This is the exact method we've seen students use to:</p>
        <ul className="my-6 mb-10 pl-6 text-[18px] leading-[1.8] text-[#333]">
          <li className="mb-4">Land roles at London-based boutiques</li>
          <li className="mb-4">Get interviews with niche PE funds</li>
          <li className="mb-4">Secure paid, part-time work during term</li>
          <li className="mb-4">Build a finance CV before uni even starts</li>
          <li className="mb-4">And walk into final year already sorted with a grad offer</li>
        </ul>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">This is the playbook we wish someone handed us when we started out. Now it's yours. Let's go get that internship.</p>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9"><em>- Team Early Edge</em></p>

        <hr className="border-0 border-t-2 border-[#eaeaea] my-20" />

        {/* ═══ MODULE 1 ═══ */}
        <h1 className="text-[46px] font-[800] text-[#111] mt-16 mb-8 pb-4 border-b-2 border-[#eaeaea] leading-[1.2] tracking-[-1px]">
          Module 1: Why Cold Email Works in Finance
        </h1>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Most students think breaking into finance means only applying to the big-name banks and going through endless application stages. But that's not the only way in.</p>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">There's a whole world of <strong className="font-[700]">smaller firms</strong>, hedge funds, family offices, PE boutiques, and prop shops that pay just as well, give you real experience, and don't make you jump through 10 hoops to get in.</p>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">They usually hire through referrals or people already in their network. So yeah they're probably not "looking" for interns. But that doesn't mean they won't take one on... if the right person reaches out.</p>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">That's where <strong className="font-[700]">cold email</strong> comes in. Instead of competing with 1,000 other students through a portal, you're starting a direct conversation with someone who can actually say "Sure, let's talk."</p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">That message can lead to:</p>
        <ul className="my-6 mb-10 pl-6 text-[18px] leading-[1.8] text-[#333]">
          <li className="mb-4">A remote project</li>
          <li className="mb-4">A paid internship</li>
          <li className="mb-4">A referral or part-time role that was never posted</li>
        </ul>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Most students never try this. Not because they're lazy, they just don't know it's even an option. But now you do. You're not sitting around hoping some online portal gets back to you. You're taking the first step, reaching out to people who actually make the decisions.</p>

        <hr className="border-0 border-t-2 border-[#eaeaea] my-20" />

        {/* ═══ MODULE 2 ═══ */}
        <h1 className="text-[46px] font-[800] text-[#111] mt-16 mb-8 pb-4 border-b-2 border-[#eaeaea] leading-[1.2] tracking-[-1px]">
          Module 2: Who to Email (and How to Find Them Fast)
        </h1>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Before you start reaching out, take a second to ask yourself: <strong className="font-[700]">What areas of finance actually interest me?</strong> You don't need a perfect answer. But having a rough idea will help you focus your outreach, sound more intentional, and avoid wasting time on firms you don't actually want to work at.</p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Here's a list of types of firms where cold outreach tends to work well. Pick 3 from this list to target first:</p>
        <ul className="my-6 mb-10 pl-6 text-[18px] leading-[1.8] text-[#333]">
          <li className="mb-4">Asset Managers</li>
          <li className="mb-4">Hedge funds</li>
          <li className="mb-4">Private equity funds</li>
          <li className="mb-4">Search funds</li>
          <li className="mb-4">Corporate finance boutiques / M&A advisory</li>
          <li className="mb-4">Family offices</li>
          <li className="mb-4">Real estate investment firms</li>
          <li className="mb-4">Venture capital / Growth equity funds</li>
          <li className="mb-4">Prop trading shops</li>
          <li className="mb-4">Distressed debt investors</li>
          <li className="mb-4">Tech-focused / Healthcare boutiques</li>
          <li className="mb-4">ESG/sustainability funds and Private credit shops</li>
        </ul>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Once you've picked your targets, figure out who to contact. Since these are small firms, your best shot is going straight to senior people. Prioritise:</p>
        <ol className="my-6 mb-10 pl-6 text-[18px] leading-[1.8] text-[#333]">
          <li className="mb-4">Founders / Managing Partners</li>
          <li className="mb-4">Managing Directors (MDs)</li>
          <li className="mb-4">Vice Presidents (VPs)</li>
          <li className="mb-4">CEOs</li>
        </ol>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">If you're struggling to find enough contacts at that level, you can also reach out to Associates and Analysts.</p>

        <h3 className="text-[24px] font-[700] text-[#222] mt-12 mb-5 leading-[1.3]">Finding Firms on Apollo.io (Company Search)</h3>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">First, sign up to Apollo.io. Once you're in, go to the Companies tab.</p>
        <ul className="my-6 mb-10 pl-6 text-[18px] leading-[1.8] text-[#333]">
          <li className="mb-4"><strong className="font-[700]">Location:</strong> United Kingdom (or specifically your city, like London, Birmingham, Manchester).</li>
          <li className="mb-4"><strong className="font-[700]">Employees:</strong> Custom range (3-15 or 10-30). Remember, you want to target Small to Medium enterprises (SMEs) which are typically much leaner. They do not have a designated HR function allowing you to reach MDs/CEOs DIRECTLY.</li>
          <li className="mb-4"><strong className="font-[700]">Industry & Keywords:</strong> Apollo's industry filter is quite broad. Think of Industry as your rough category. Then, in Keywords, add "asset management" or "private equity." This makes sure the firm actually mentions that term somewhere in its company profile.</li>
        </ul>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9"><em>Tip: if you're stuck, ask ChatGPT: "What industries and keywords should I use on Apollo to find small private equity firms in the UK?" You'll get a solid list of inputs to try.</em></p>

        <h3 className="text-[24px] font-[700] text-[#222] mt-12 mb-5 leading-[1.3]">Finding Contacts on Apollo (People Search)</h3>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Once you've got your firms, head to the "People" tab. Filter by Job Title (Managing Partner, MD, VP, CEO). You can also add in associates and analysts. Then set the Contact Location to match your company search (e.g., United Kingdom or London).</p>

        <h3 className="text-[24px] font-[700] text-[#222] mt-12 mb-5 leading-[1.3]">Exporting The Smarter Way (ExportApollo)</h3>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">With Apollo's free plan, you can only manually view around 175 people before it blocks you and tells you to upgrade. Manually copying them works, but it's slow and the emails aren't verified.</p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9"><strong className="font-[700]">Option 2: The Smarter Way (What We Use)</strong><br />ExportApollo is a third-party tool that lets you pull your entire Apollo search into a clean Google Sheet with verified emails, cleaned company names, and extra data.</p>
        <ol className="my-6 mb-10 pl-6 text-[18px] leading-[1.8] text-[#333]">
          <li className="mb-4">Go to exportapollo.com, press Sign Up and head over to the Dashboard. Name your list (e.g., "UK Private Equity 3-15 Staff").</li>
          <li className="mb-4">Copy the URL from your Apollo people search and paste it into ExportApollo. Enter the amount of leads to extract. (If it's under 1000, still enter 1000. That's the minimum charge).</li>
          <li className="mb-4"><strong className="font-[700]">Adjust Settings:</strong> Turn ON "Scrape only available emails" (avoids wasting credits), "Email verification" (double-checks emails), "Company Name Cleaning" (Removes "LLP" or "Limited"), and "Extra Data".</li>
        </ol>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Click "Pay & Scrape" and you'll receive a Google Sheet delivered to your email. <strong className="font-[700]">DISCLAIMER:</strong> Leads often take 48h to deliver. You also receive an invoice upon your purchase, giving us perfect time to work on the template.</p>

        {/* Callout: 200 Firm Head Start */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] border-l-[6px] border-l-[#0f172a] p-10 my-12 rounded-lg shadow-md">
          <h3 className="text-[24px] font-[700] text-[#222] mb-5 leading-[1.3]">Your 200 Firm Head Start</h3>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-9">We've put together a curated list of 200 firms across Private Equity, Venture Capital, Investment Banking, Law, Consulting, Hedge Funds, SaaS, and Fintech, all based in the UK, all with small teams, and all the type of firm that responds to cold emails.</p>
          <p className="text-[18px] leading-[1.8] text-[#333] m-0">[Access the full list here], Combine it with your own Apollo searches and you'll never run out of people to email.</p>
        </div>

        <hr className="border-0 border-t-2 border-[#eaeaea] my-20" />

        {/* ═══ MODULE 3 ═══ */}
        <h1 className="text-[46px] font-[800] text-[#111] mt-16 mb-8 pb-4 border-b-2 border-[#eaeaea] leading-[1.2] tracking-[-1px]">
          Module 3: Clean Your Leads and Write First Lines
        </h1>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Now that you've exported your Apollo leads as a CSV, it's time to clean them up so you're only messaging people at firms that actually matter, with personalised openers that make you stand out.</p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Download the <strong className="font-[700]">EarlyEdge Cold Email Tracker</strong>. This is where all of your contacts will live from start to finish. Here, you'll clean your leads, track your sends, log your responses, and monitor your stats.<br />[Download the EarlyEdge Cold Email Tracker here]</p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Open your CSV file. Delete all columns except: First Name, Last Name, Title, Email, LinkedIn Link, Cleaned Company Name, Company Website, Company Full Name, Company Short Description. Copy your CSV data straight into the 'Outreach' sheet of your EarlyEdge Tracker.</p>

        <h3 className="text-[24px] font-[700] text-[#222] mt-12 mb-5 leading-[1.3]">Step 2: The "First Line" Column</h3>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">You'll see a 'First Line' Column already set up in your Outreach sheet. This is where you'll write your personalised opening sentence. Don't spend 10 minutes per contact trying to find the perfect thing to say.</p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9"><strong className="font-[700]">Structure: An Observation + A Simple Question.</strong> The goal is to show you've looked them up and you're actually curious about learning more.</p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9"><strong className="font-[700]">The 2-minute method:</strong></p>
        <ul className="my-6 mb-10 pl-6 text-[18px] leading-[1.8] text-[#333]">
          <li className="mb-4">Check their LinkedIn profile (30 seconds). Scan their headline, their current role, and look for a career change, previous notable firm, or promotion.</li>
          <li className="mb-4">Check the Company Short Description (30 seconds). Does the firm do something specific or specialise in a niche area? Have they won an award?</li>
          <li className="mb-4">Check the Company Website (30 seconds). Scan their homepage or 'About' page. Look for a recent project or a mission statement.</li>
          <li className="mb-4">Write the line (30 seconds). Take whatever you found and turn it into a short observation followed by a simple question.</li>
        </ul>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9"><strong className="font-[700]">Fallback templates if you are stuck:</strong></p>
        <ul className="my-6 mb-10 pl-6 text-[18px] leading-[1.8] text-[#333]">
          <li className="mb-4">"I came across your profile and was inspired by your story, especially how you [Copy paste what you found interesting], what was that like?"</li>
          <li className="mb-4">"I saw you've been at [Current Firm] for [X] years now, how's the experience been so far?"</li>
          <li className="mb-4">"I saw you've moved from [IB/Consulting] into [New Type of Work], what was that transition like?"</li>
          <li className="mb-4">"I noticed you went from a larger fund to a boutique, does it feel more hands-on day to day?"</li>
          <li className="mb-4">"I noticed X deals in [Company aim], how are you navigating in this economic climate?"</li>
        </ul>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Clean your sheet row by row. Read the Company Description, if the firm isn't relevant, delete the row. Make sure the "Cleaned Company Name" reads naturally (e.g., change "Phoenix Asset Management Partners" to "Phoenix"). Every row in your Outreach sheet should be a relevant contact at a firm you actually want to work at.</p>

        <hr className="border-0 border-t-2 border-[#eaeaea] my-20" />

        {/* ═══ MODULE 4 ═══ */}
        <h1 className="text-[46px] font-[800] text-[#111] mt-16 mb-8 pb-4 border-b-2 border-[#eaeaea] leading-[1.2] tracking-[-1px]">
          Module 4: Write Your Cold Email Template
        </h1>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">When writing your template, it is important to keep in mind those you outreach to are extremely busy. Set yourself apart. Think of your cold email as a conversation starter, not a cover letter. It should be short, clear, and human, something the person can read in under 30 seconds.</p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Your goal is to prove three things: 1) You're genuinely interested in what the firm does, 2) You're eager to learn, 3) You'd be happy to help in any way you can.</p>

        <h3 className="text-[24px] font-[700] text-[#222] mt-12 mb-5 leading-[1.3]">Email Template Structure</h3>

        <ol className="my-6 mb-10 pl-6 text-[18px] leading-[1.8] text-[#333]">
          <li className="mb-4"><strong className="font-[700]">Subject Line:</strong> Get this wrong and even the best cold email sits unread. The format we recommend: <code className="font-mono bg-[#f5f5f5] px-1.5 py-0.5 rounded">[Your Name], [Your University] Cold Email</code>. Or: <code className="font-mono bg-[#f5f5f5] px-1.5 py-0.5 rounded">[UNI] student eager to contribute</code>. This format consistently gets 3x more opens because it looks like a real email, not a sales pitch.</li>
          <li className="mb-4"><strong className="font-[700]">Personalised First Line:</strong> Plug in your First Line observation. Show you've done your research.</li>
          <li className="mb-4"><strong className="font-[700]">Intro + Context:</strong> Who you are, what you're studying. Keep it short 1-2 sentences max.</li>
          <li className="mb-4"><strong className="font-[700]">Why You're Reaching Out (The Ask):</strong> Briefly explain why you're messaging them. Make it clear you are seeking a paid or unpaid internship this summer, even to contribute for a short period. This is the <strong className="font-[700]">human touch</strong> most AI-driven outreach lacks.</li>
          <li className="mb-4"><strong className="font-[700]">Experience or Proof of Initiative:</strong> Show HOW your experience relates. If you've done Spring Weeks, society work, or anything relevant, mention it. If you don't have experience, lean into curiosity ("I've been exploring the industry via societies, reading about deals, building a project..."). Identify areas where you can provide value: slide deck preparation, market research, or Excel models.</li>
          <li className="mb-4"><strong className="font-[700]">Close + CV:</strong> Thank them, let them know your CV is attached, and say you're happy to chat briefly.</li>
        </ol>

        <h3 className="text-[24px] font-[700] text-[#222] mt-12 mb-5 leading-[1.3]">7 Rules for Writing</h3>
        <ul className="my-6 mb-10 pl-6 text-[18px] leading-[1.8] text-[#333]">
          <li className="mb-4"><strong className="font-[700]">1. Personalise the First Line:</strong> Always start with something specific to the person or firm.</li>
          <li className="mb-4"><strong className="font-[700]">2. Keep It Short and Skimmable:</strong> 120-180 words is the sweet spot. Use line breaks after every 2-3 sentences. Don't cram your CV into the email.</li>
          <li className="mb-4"><strong className="font-[700]">3. Lead With Humility:</strong> Don't act like you're owed a job. Position it as: "I'm keen to learn, and happy to help wherever I can."</li>
          <li className="mb-4"><strong className="font-[700]">4. Offer Paid or Unpaid Help:</strong> It shows you're genuinely looking to learn. Most firms will respect this, and many will offer to pay you anyway.</li>
          <li className="mb-4"><strong className="font-[700]">5. Make Your Ask Clear:</strong> Don't say "I'd love to connect" or "pick your brain." Say: "I'd love to gain experience at your firm this summer."</li>
          <li className="mb-4"><strong className="font-[700]">6. Attach Your CV (Always):</strong> Mention that it's attached so they know to look.</li>
          <li className="mb-4"><strong className="font-[700]">7. Read Your Email Out Loud:</strong> If it sounds robotic, rewrite it. If it sounds like something you'd actually say, it's ready.</li>
        </ul>

        {/* Example Email 1 */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] border-l-[6px] border-l-[#0f172a] p-10 my-12 rounded-lg shadow-md">
          <h3 className="text-[24px] font-[700] text-[#222] mb-5 leading-[1.3]">Example Cold Email 1 (No Formal Experience)</h3>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6"><strong className="font-[700]">Subject: Dylan Dhariwal, LSE Cold Email</strong></p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">Hi Mr Johnson,</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">I came across your firm while researching smaller private equity funds, I was wondering, what's it like working in a smaller team environment?</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">My name is Dylan Dhariwal, and I'm a first-year Finance student at the London School of Economics. I'm reaching out because I'd love to get unpaid or paid experience this summer at ABC Ventures, and gain exposure to the kind of investing work your team does.</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">I've been exploring the space through LSE societies, reading about deals, and building a project where I track and break down interesting funds in Europe. It's made me realise how much I enjoy thinking like an investor and I'd love to learn from people doing this day-to-day.</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">I'd be grateful for any opportunity to support your team, whether through research, presentation support, or analytical tasks. I've attached my [CV here] for reference, and I'd be happy to jump on a quick call if useful.</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">Best regards,</p>
          <p className="text-[18px] leading-[1.8] text-[#333] m-0">Dylan Dhariwal</p>
        </div>

        {/* Example Email 2 */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] border-l-[6px] border-l-[#0f172a] p-10 my-12 rounded-lg shadow-md">
          <h3 className="text-[24px] font-[700] text-[#222] mb-5 leading-[1.3]">Example Cold Email 2 (Some Experience)</h3>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6"><strong className="font-[700]">Subject: Tony Walker, LSE Cold Email</strong></p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">Hi Mr Allen,</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">I saw you joined ABC Associates not too long ago, what drew you to the team?</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">My name is Tony Walker, and I'm a first-year BSc Finance student at the London School of Economics. I'm reaching out to express interest in getting unpaid or paid experience this summer at ABC Associates, even just a short project would be a great chance to learn.</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">I've completed spring weeks at RBC and Nomura, interned at J.P. Morgan, and currently work as an analyst at Sortino M&A, a student-led research group. These experiences taught me how to build pitch decks, analyse companies, and think critically about deals and they've made me realise I really enjoy corporate finance and advisory work.</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">I'd be grateful for any opportunity to contribute, whether through market research, supporting presentations, or analytical tasks. I've [linked my CV here] for reference.</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">Best regards,</p>
          <p className="text-[18px] leading-[1.8] text-[#333] m-0">Tony Walker</p>
        </div>

        {/* Example Email 3 */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] border-l-[6px] border-l-[#0f172a] p-10 my-12 rounded-lg shadow-md">
          <h3 className="text-[24px] font-[700] text-[#222] mb-5 leading-[1.3]">Example Cold Email 3 (Referral)</h3>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6"><strong className="font-[700]">Subject: Priya Sharma, UCL | Introduced by Sarah Mitchell</strong></p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">Hi Mrs Langford,</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">Sarah Mitchell kindly suggested I reach out to you after we spoke about the advisory work your team does at Whitmore Partners, particularly around the mid-market M&A space.</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">My name is Priya, and I'm a first-year Economics student at UCL. Sarah mentioned that your team occasionally brings on interns, and I wanted to reach out directly to see if there might be an opportunity to gain unpaid or paid experience this summer.</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">I've spent the last year as a research lead at UCL's student-run investment fund, where I've been covering European industrials and presenting stock pitches to our committee. It's given me a genuine interest in how deals come together and I'd love to see that process up close in a live environment.</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">I'd be happy to help with anything that's useful to the team, whether that's research, due diligence support, or putting together materials. I've attached my [CV] and happy to chat whenever suits you.</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">Best regards,</p>
          <p className="text-[18px] leading-[1.8] text-[#333] m-0">Priya Sharma</p>
        </div>

        {/* Example Email 4 */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] border-l-[6px] border-l-[#0f172a] p-10 my-12 rounded-lg shadow-md">
          <h3 className="text-[24px] font-[700] text-[#222] mb-5 leading-[1.3]">Example Cold Email 4 (Non-Finance Industry)</h3>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6"><strong className="font-[700]">Subject: Marcus Campbell, Warwick Cold Email</strong></p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">Hi Mr Evans,</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">I read your recent LinkedIn post about the operational restructuring project you led for a public sector client last year. Cutting procurement costs by 30% without reducing headcount really stood out to me, how did you manage to do that?</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">My name is Marcus Campbell and I'm a second-year Politics and Economics student at Warwick. I'm reaching out to express my interest in gaining unpaid or paid experience at Aventa this summer, I would love to see how your firm helps organisations solve problems that seem impossible from the inside.</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">Through my role as VP of Warwick's Consulting Society, I've led two pro-bono projects for local businesses, one focused on customer retention strategy and another on streamlining internal operations for a small logistics company. Both taught me how much I enjoy breaking down messy problems and working in small teams to find practical solutions.</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">I'd be grateful for any opportunity to contribute this summer, whether it's research, client support, workshop prep, or whatever would be most helpful. I've attached my [CV] and am happy to jump on a quick call at any time that suits you.</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-6">Best regards,</p>
          <p className="text-[18px] leading-[1.8] text-[#333] m-0">Marcus Campbell</p>
        </div>

        <hr className="border-0 border-t-2 border-[#eaeaea] my-20" />

        {/* ═══ MODULE 5 ═══ */}
        <h1 className="text-[46px] font-[800] text-[#111] mt-16 mb-8 pb-4 border-b-2 border-[#eaeaea] leading-[1.2] tracking-[-1px]">
          Module 5: How to Send Cold Emails Using Outlook Mail Merge
        </h1>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">You've done the hard work: built your list, cleaned it, written first lines, and built a solid cold email template. Now it's time to actually send the emails. This module walks you through how to send using Outlook Mail Merge = the cleanest, safest method we recommend for students.</p>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9"><strong className="font-[700]">Why Outlook?</strong> We've tested this. Outlook gets better reply rates than Gmail for cold emails. Every student has access to Microsoft tools via their university login, and sending from an academic <code className="font-mono bg-[#f5f5f5] px-1.5 py-0.5 rounded">.ac.uk</code> domain bypasses the stringent spam filters that crush random Gmails.</p>

        <h3 className="text-[24px] font-[700] text-[#222] mt-12 mb-5 leading-[1.3]">Step-by-Step Outlook Mail Merge</h3>
        <ol className="my-6 mb-10 pl-6 text-[18px] leading-[1.8] text-[#333]">
          <li className="mb-4"><strong className="font-[700]">Step 1: Duplicate and Prepare Your Sheet.</strong> Go back to the Google Sheet and make a copy (e.g. "Internship Sending Sheet"). Add a new column called "Sent" and format it as checkboxes. Download this as a CSV file to your desktop.</li>
          <li className="mb-4"><strong className="font-[700]">Step 2: Start Mail Merge.</strong> Open Microsoft Word. Go to <strong className="font-[700]">Mailings</strong> → Start Mail Merge → Email Messages. Click <strong className="font-[700]">Select Recipients</strong> → Use an Existing List and upload your CSV.</li>
          <li className="mb-4"><strong className="font-[700]">Step 3: Write Template with Placeholders.</strong> Paste your draft and use <strong className="font-[700]">Insert Merge Field</strong> for First name, Last name, first line, cleaned company name. e.g. <code className="font-mono bg-[#f5f5f5] px-1.5 py-0.5 rounded">Hi Mr «Last_Name_»,</code> and <code className="font-mono bg-[#f5f5f5] px-1.5 py-0.5 rounded">«First_Line_»</code>. Note: do not leave manual spaces on your spreadsheet which may corrupt uneven spacing.</li>
          <li className="mb-4"><strong className="font-[700]">Step 4: Add Your CV Link.</strong> Upload your CV to Google Drive/OneDrive, set to "Anyone with the link can view". Use Ctrl+K in Word to hyperlink it.</li>
        </ol>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9"><strong className="font-[700]">Step 5: CRITICAL CHECK.</strong> Click <strong className="font-[700]">"Edit Individual Documents"</strong> on the Finish & Merge icon! This is a LIFE SAVER. Always check this to correct typos, grammar issues, and corrupted texts before it goes to a CEO.</p>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9"><strong className="font-[700]">Step 6: Finish & Send.</strong> Click Merge to Email. Ensure Outlook is your default mail app. Enter your Subject line. Make sure it is sent as <code className="font-mono bg-[#f5f5f5] px-1.5 py-0.5 rounded">HTML message</code> format (Mandatory, or your formatting breaks). Hit OK to start sending!</p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Well done, you've just done what 99% of the student population are NOT doing.</p>

        {/* When to send callout */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] border-l-[6px] border-l-[#0f172a] p-10 my-12 rounded-lg shadow-md">
          <h3 className="text-[24px] font-[700] text-[#222] mb-5 leading-[1.3]">When Should I send my emails?</h3>
          <p className="text-[18px] leading-[1.8] text-[#333] m-0">Sending 7-8 AM or 3-5 PM is suboptimal. Instead, sending exactly at <strong className="font-[700]">9:03 AM</strong> jumps on top of all the client emails and morning junk they just cleared. It allows you to stand out in the 9:00, 10:00 AM window.</p>
        </div>

        <h3 className="text-[24px] font-[700] text-[#222] mt-12 mb-5 leading-[1.3]">Automate Your Outreach with GMass</h3>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Sending 30-50 emails daily through Outlook takes time. If you're juggling coursework, GMass automates the entire process directly from your Gmail account.</p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9"><strong className="font-[700]">Important Trade-off to Understand:</strong></p>
        <ul className="my-6 mb-10 pl-6 text-[18px] leading-[1.8] text-[#333]">
          <li className="mb-4"><strong className="font-[700]">Outlook (via school email):</strong> Higher reply rates, emails land directly in inboxes because <code className="font-mono bg-[#f5f5f5] px-1.5 py-0.5 rounded">.ac.uk</code> domains have a strong reputation. But it's an intentional, manual process.</li>
          <li className="mb-4"><strong className="font-[700]">GMass (via Gmail):</strong> Fully automated (set it and forget it, send 100s while you sleep). But you'll see lower deliverability; Gmail addresses hit spam filters more often.</li>
        </ul>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Our Recommendation: Start with Outlook to test your template and get initial replies. Once you've proven what works, consider GMass if you need to scale massively and can accept lower reply rates in exchange for volume. Remember: 10 quality conversations from Outlook beats 100 ignored Gmail emails.</p>

        <hr className="border-0 border-t-2 border-[#eaeaea] my-20" />

        {/* ═══ MODULE 6 ═══ */}
        <h1 className="text-[46px] font-[800] text-[#111] mt-16 mb-8 pb-4 border-b-2 border-[#eaeaea] leading-[1.2] tracking-[-1px]">
          Module 6: What to Do After Sending (Responses & Follow-Ups)
        </h1>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Now it's about consistency. After you send, go back to your Google Sheet and tick the checkbox under the "Sent" column. Keep a consistent schedule: send 30 cold emails per day minimum. If deliverability is good, scale it to 50 a day. Send Monday to Friday (avoid weekends). Aim for a consistent time (9:03 AM). Note: It is very common for 2-3 out of 50 emails to bounce back. This is perfectly normal.</p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">You will likely receive a typical rejection. But sometimes, MDs will reject you and offer you advice or a 10-minute chat instead. Treat this as a massive win, say YES to every call.</p>

        <h3 className="text-[24px] font-[700] text-[#222] mt-12 mb-5 leading-[1.3]">The Follow-Up Method</h3>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">The fortune is in the follow up. It shows persistence which MDs respect. Schedule follow-ups the night before to be sent at exactly 9:03 AM the next day. If you don't get a reply after 5-7 days, send one polite follow-up nudge.</p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9"><strong className="font-[700]">When to follow up:</strong> Create a 'Followed up?' tab and enter the date. Example: an email sent on Monday 1st January would need to be followed up on Monday January 8th. As you progress, tighten this to 4 business days (e.g., an email sent Monday January 22nd is followed up on Friday 26th). At my peak I was sending 100 emails a day: 50 follow-ups and 50 mail-merges.</p>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9 italic">Example Nudge: "Hi [Name], Just wanted to follow up on my previous email in case it got lost in your inbox. I'd still love the chance to learn more about your work at [Firm Name] and help however I can this summer. Thanks again, [Your Name]."</p>

        <h3 className="text-[24px] font-[700] text-[#222] mt-12 mb-5 leading-[1.3]">I have a meeting, what next?</h3>
        <ol className="my-6 mb-10 pl-6 text-[18px] leading-[1.8] text-[#333]">
          <li className="mb-4"><strong className="font-[700]">Reply immediately:</strong> Aim to reply within the first 10 minutes. Suggest times to make it frictionless for them. Mark it in your calendar.</li>
          <li className="mb-4"><strong className="font-[700]">Be Punctual & Prepared:</strong> Do your due diligence on a recent deal or their background. Drop a nugget of insight in the first 5 minutes to quickly impress them.</li>
          <li className="mb-4"><strong className="font-[700]">Be Human:</strong> Share the excitement with them without being inauthentic. 95% of these calls are informal chats. Go in open minded, ready to learn and ask questions. Ask them how their day was, and be curious about the work they do.</li>
          <li className="mb-4"><strong className="font-[700]">Be Direct:</strong> When asked to introduce yourself and what you are looking for, do NOT be afraid to set out your aims and desires. You don't want to spend the summer doing something you hate.</li>
          <li className="mb-4"><strong className="font-[700]">Follow-Up Email:</strong> Write a reflection after every call. Note down what they asked and deals they mentioned. Include this detail in your post-meeting "Thank You" email! Make sure to connect with them on LinkedIn.</li>
        </ol>

        {/* Meeting 10 callout */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] border-l-[6px] border-l-[#0f172a] p-10 my-12 rounded-lg shadow-md">
          <h3 className="text-[24px] font-[700] text-[#222] mb-5 leading-[1.3]">Meeting 10: What I did after 15 offers</h3>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Lets set the scene, you've been at it for 1-2 weeks and landed 5 offers but you want to keep searching to find what's right for you. Your answers get refined with each call and your confidence grows. You dictate where the conversation goes, asking to take a few days to think about before accepting or declining it.</p>
          <p className="text-[18px] leading-[1.8] text-[#333] mb-3">Gauge your offers based on 4 factors:</p>
          <ul className="pl-6 text-[18px] leading-[1.8] text-[#333]">
            <li className="mb-3">A) Will I have actual tangible work?</li>
            <li className="mb-3">B) Is it paid and can I grow my network?</li>
            <li className="mb-3">C) Is the work meaningful or just repetitive admin?</li>
            <li className="mb-0">D) Is their support framework going to help me flourish?</li>
          </ul>
        </div>

        <h3 className="text-[24px] font-[700] text-[#222] mt-12 mb-5 leading-[1.3]">Top Tips I used to optimise my outreach</h3>
        <ul className="my-6 mb-10 pl-6 text-[18px] leading-[1.8] text-[#333]">
          <li className="mb-4"><strong className="font-[700]">Identifying Tangible Leads:</strong> Flagging deals/leads I could convert and pinning their conversations in Outlook so they were easily accessible.</li>
          <li className="mb-4"><strong className="font-[700]">Immediate Scheduling:</strong> As soon as I finished a meeting, writing a follow-up/rejection which I could schedule to send for another date so I would not forget.</li>
          <li className="mb-4"><strong className="font-[700]">Reflecting Daily:</strong> Reflecting on the day's emails and identifying next steps I had to take.</li>
          <li className="mb-4"><strong className="font-[700]">Batching The Workload:</strong> Over time your motivation will fade, so relying on this exact system is critical. Writing 50 first lines felt like it took forever so I began to split it up over hours, 5 first lines at the start of every hour, or 25 in the morning and 25 in the evening to manage the workload and prevent burnout.</li>
          <li className="mb-4"><strong className="font-[700]">Simplifying the Process:</strong> Doing the simplest of things to make my outreach as seamless as possible like loading up 25 emails ready to send on my laptop so the first thing I opened was mailmerge and could press send.</li>
        </ul>

        <hr className="border-0 border-t-2 border-[#eaeaea] my-20" />

        {/* ═══ FINAL THOUGHTS ═══ */}
        <h1 className="text-[46px] font-[800] text-[#111] mt-16 mb-8 pb-4 border-b-2 border-[#eaeaea] leading-[1.2] tracking-[-1px]">
          Final Thoughts
        </h1>

        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Congratulations you've successfully completed the course! If you've made it this far, you've already done more than 99% of students who say they "want" finance experience.</p>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">You've learned how to find the right lean firms, pull verified contacts effectively, write genuine outreach, format First Lines that stand out, bypass Gmail spam filters with Outlook Mail Merge, and dominate the 9:03 AM inbox window.</p>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">This system is simple, but it works because it's consistent, targeted, and intensely personal. Every new email sent, and meeting had is a chance to learn and meet new people.</p>

        <h3 className="text-[24px] font-[700] text-[#222] mt-12 mb-5 leading-[1.3]">Need Help or Want Feedback?</h3>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">If you get stuck at any point, whether that's cleaning your list, writing first lines, or in Mail Merge, feel free to reach out. By the time you're reading this, the Early Edge Cold Email Community should be live. We share results and learn together.</p>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">Or, email Don directly at 📩 <strong className="font-[700]">d.awotwi@lse.ac.uk</strong>. He will personally help you troubleshoot or refine your outreach.</p>

        <h3 className="text-[24px] font-[700] text-[#222] mt-12 mb-5 leading-[1.3]">What Happens Next</h3>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">If you stick with this and send consistently, you will start getting replies. Those replies will lead to calls. And those calls will turn into opportunities. It won't happen overnight, but it will happen if you keep going.</p>
        <p className="text-[18px] leading-[1.8] text-[#333] mb-9">You now have the full system. You know what to do. All that's left is to show up and send the next email. You've got this.</p>
        <p className="text-[18px] leading-[1.8] text-[#333] m-0"><strong className="font-[700]">- Team Early Edge</strong></p>

      </div>
    </div>
  );
}
