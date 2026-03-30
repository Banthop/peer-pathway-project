import { ArrowLeft, BookOpen, Quote, Target, Mail, Send, CheckCircle2, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function ColdEmailGuide() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111] font-sans selection:bg-emerald-200 pb-24">
      
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
          className="text-[12px] font-bold text-white bg-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          Book 1-on-1 Review
        </Link>
      </div>

      {/* ════════ MAIN CONTENT ════════ */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 pt-16">
        
        {/* Title Block */}
        <div className="mb-16">
          <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4">By Uthman</p>
          <h1 className="text-4xl md:text-[44px] font-black tracking-tight leading-tight mb-6">
            The EarlyEdge Cold Email System
          </h1>
          <p className="text-xl text-[#666] font-light leading-relaxed">
            The exact system used to secure 20+ offers across Investment Banking, Private Equity, and Venture Capital.
          </p>
        </div>

        <div className="prose prose-lg prose-emerald max-w-none text-[#333]">
          
          {/* Welcome Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#111] mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-500" />
              Welcome
            </h2>
            <p>
              Welcome to the EarlyEdge Cold Email System. This guide contains everything you need to start getting fast-tracked for roles through cold email.
            </p>
            <p>
              Before you start, understand this: <strong>cold email is the highest ROI activity you can do as a student.</strong>
            </p>
            <p>
              Why? Because 95% of students won't do it. They rely purely on online applications. 
              When you apply online, you are one of a thousand. When you send a good cold email, you bypass HR entirely and speak directly to decision makers.
            </p>
            <p>
              Most people think cold email is just "networking". It isn't. It's a sales process. 
              And like any sales process, it requires volume, persistence, and a system.
            </p>
            <p>That's exactly what this guide is.</p>

            <h3 className="text-xl font-bold text-[#111] mt-10 mb-4">What This Guide Will Do For You</h3>
            <p>This guide is a complete, end-to-end system. By the end, you will know:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> <span>Exactly <strong>WHO</strong> to email</span></li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> <span>Exactly <strong>WHAT</strong> to say</span></li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> <span>Exactly <strong>HOW</strong> to find their direct email</span></li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> <span>Exactly <strong>HOW</strong> to send emails at scale</span></li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> <span>Exactly <strong>WHAT</strong> to do when they reply</span></li>
            </ul>

            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl my-8">
              <p className="m-0 text-[#222] font-medium italic">
                A quick note on mindset: You will get ignored. You will get rejected. But all it takes is ONE reply to change the trajectory of your career. If you commit to sending 50 emails using this system, I guarantee you will see results.
              </p>
            </div>
            
            <p className="font-bold">Let's get started.</p>
          </section>

          <hr className="border-[#E8E8E8] my-12" />

          {/* Module 1 */}
          <section className="mb-16">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Module 1</p>
            <h2 className="text-3xl font-bold text-[#111] mb-6">Why Cold Email Works for Students</h2>
            <p>There are three reasons why cold emailing as a student is disproportionately effective:</p>
            
            <div className="space-y-6 my-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#111] text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="text-lg font-bold text-[#111] mb-1">You are non-threatening.</h4>
                  <p className="text-[#555] m-0">When a recruiter emails a Managing Director, they are trying to sell them something. When a student emails a Managing Director, they just want advice. People naturally want to help ambitious young people. It feeds their ego and reminds them of themselves at your age.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#111] text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="text-lg font-bold text-[#111] mb-1">It shows extreme initiative.</h4>
                  <p className="text-[#555] m-0">Simply by sending a cold email, you are demonstrating proactivity, communication skills, and commercial awareness. These are exactly the traits firms look for in juniors.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#111] text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="text-lg font-bold text-[#111] mb-1">It bypasses the HR filter.</h4>
                  <p className="text-[#555] m-0">HR's job is to screen people OUT. A Managing Director's job is to bring talent IN. If an MD likes you, they will forward your CV to HR and say "interview this person".</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#111] mt-10 mb-4">The Goal of a Cold Email</h3>
            <p>The goal of a cold email is NOT to ask for a job. <br/><strong>The goal of a cold email is to get a 15-minute phone call.</strong></p>
            <p>Once you are on the phone call, your goal is to build rapport, ask intelligent questions, and at the very end, ask them to point you in the right direction for recruiting.</p>
          </section>

          <hr className="border-[#E8E8E8] my-12" />

          {/* Module 2 */}
          <section className="mb-16">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Module 2</p>
            <h2 className="text-3xl font-bold text-[#111] mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-500" />
              Who to Cold Email
            </h2>
            <p>You don't want to email HR. You want to email the people actually doing the job you want.</p>
            <p>For Investment Banking, this means emailing Analysts, Associates, VPs, and Managing Directors.</p>

            <h3 className="text-xl font-bold text-[#111] mt-8 mb-3">Finding the Right People</h3>
            <p>Use LinkedIn. Search for: <code>[Firm Name] + [Role]</code></p>
            <p className="bg-[#F5F5F5] p-4 rounded-lg text-sm font-mono text-[#555] border border-[#E8E8E8]">Example: "Goldman Sachs Investment Banking Analyst"</p>

            <h3 className="text-xl font-bold text-[#111] mt-8 mb-3">Focus on Alumni</h3>
            <p>It is 10x easier to get a reply from an alumni of your university. Filter your LinkedIn search by your university (e.g., LSE, Warwick, Bristol).</p>
            <p>If you exhaust alumni, then search for people who share your background (same societies, same hometown, same sports team).</p>

            <div className="bg-[#111] text-white p-6 rounded-xl my-8">
              <h4 className="text-lg font-bold flex items-center gap-2 mb-2"><Zap className="w-5 h-5 text-amber-400" /> The "50 Firm" Rule</h4>
              <p className="text-white/80 m-0">
                Most students apply to 5 bulge bracket banks and give up. This is a losing strategy. There are hundreds of boutique banks, private equity firms, and search funds in London. <strong>You need to build a list of 50+ firms.</strong> The broader your list, the higher your chances of success.
              </p>
            </div>
          </section>

          <hr className="border-[#E8E8E8] my-12" />

          {/* Module 3 */}
          <section className="mb-16">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Module 3</p>
            <h2 className="text-3xl font-bold text-[#111] mb-6 flex items-center gap-3">
              <Mail className="w-8 h-8 text-[#111]" />
              The Cold Email Formula
            </h2>

            <p>A cold email should never be longer than 4-5 sentences. Decision makers read emails on their phones between meetings. Keep it brief.</p>

            <p>The formula we use is called the <strong>"3-Part Framework"</strong>: The Hook, The Value, and The Ask.</p>

            <ul className="space-y-4 my-6 list-none pl-0">
              <li className="bg-white border border-[#E8E8E8] p-4 rounded-xl shadow-sm">
                <strong className="text-emerald-700">1. The Hook (1 sentence):</strong> Who you are and why you are emailing them specifically.
              </li>
              <li className="bg-white border border-[#E8E8E8] p-4 rounded-xl shadow-sm">
                <strong className="text-emerald-700">2. The Value (1-2 sentences):</strong> What you have done that makes you worth talking to.
              </li>
              <li className="bg-white border border-[#E8E8E8] p-4 rounded-xl shadow-sm">
                <strong className="text-emerald-700">3. The Ask (1 sentence):</strong> A clear, low-friction request for a quick chat.
              </li>
            </ul>

            <h3 className="text-xl font-bold text-[#111] mt-8 mb-3">Subject Line</h3>
            <p>Keep it simple. Mention your university or background.</p>
            <ul className="list-disc pl-5 space-y-1 mb-8 text-[#555]">
              <li>"LSE Student reaching out"</li>
              <li>"Aspiring analyst - Warwick undergrad"</li>
              <li>"Question from a fellow Bristol alumni"</li>
            </ul>

            <h3 className="text-xl font-bold text-[#111] mt-8 mb-4">Example Email Structure</h3>
            
            <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden shadow-sm my-6">
              <div className="bg-[#F8F8F8] border-b border-[#E8E8E8] px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="p-6 text-[15px] leading-relaxed text-[#333] font-mono bg-white">
                <p>Hi [Name],</p>
                <p>I hope you're having a good week.</p>
                <p>I'm a second-year at [University] studying [Subject], and I saw your profile while researching [Firm Name]. I noticed you transitioned from [Background] to [Role], which is exactly what I'm aiming to do.</p>
                <p>I recently completed a spring week at [Firm] and am now preparing for summer analyst recruiting.</p>
                <p>Would you have 10 minutes for a quick chat sometime next week? I'd love to hear your advice on navigating the process.</p>
                <p>Best,<br/>[Your Name]</p>
              </div>
            </div>

            <p className="text-sm text-[#888] italic">Notice how short this is. It doesn't ask for a job. It asks for advice.</p>
          </section>

          <hr className="border-[#E8E8E8] my-12" />

          {/* Module 4 */}
          <section className="mb-16">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Module 4</p>
            <h2 className="text-3xl font-bold text-[#111] mb-6">How To Find Direct Emails</h2>
            <p>Never send cold emails on LinkedIn. Always find their direct work email. LinkedIn messages get ignored; work emails get read.</p>

            <h3 className="text-xl font-bold text-[#111] mt-8 mb-3">The Strategy</h3>
            <p>Most corporate emails follow a standard format:</p>
            <ul className="list-disc pl-5 space-y-1 mb-6 text-[#555] font-mono text-sm">
              <li>first.last@firm.com</li>
              <li>flast@firm.com</li>
              <li>f.last@firm.com</li>
            </ul>

            <h3 className="text-xl font-bold text-[#111] mt-8 mb-3">The Tools</h3>
            <ul className="space-y-2 mb-6 text-[#555]">
              <li><strong>Hunter.io</strong> (Finds the email format for a specific domain)</li>
              <li><strong>RocketReach</strong> (Good for finding specific individuals)</li>
              <li><strong>Clearbit Connect</strong> (Chrome extension)</li>
            </ul>

            <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl my-6">
              <h4 className="text-lg font-bold text-amber-900 mb-2">The Verification Rule</h4>
              <p className="text-amber-800 m-0">
                If tools fail, guess the email using the standard formats and plug it into an email verifier like MailTester.com. If it returns "valid", you found it. <strong>Always verify the email before sending.</strong> Sending too many bounced emails will hurt your sender reputation and send your future emails to spam.
              </p>
            </div>
          </section>

          <hr className="border-[#E8E8E8] my-12" />

          {/* Module 5 */}
          <section className="mb-16">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Module 5</p>
            <h2 className="text-3xl font-bold text-[#111] mb-6 flex items-center gap-3">
              <Send className="w-8 h-8 text-indigo-500" />
              Sending at Scale
            </h2>
            <p>If you are sending 50+ emails, doing it manually takes too long. You need to use Mail Merge to send personalized emails at scale.</p>

            <p>Mail Merge takes a list of contacts from an Excel spreadsheet and automatically inserts their names and details into an email template.</p>

            <h3 className="text-xl font-bold text-[#111] mt-8 mb-4">Step-by-Step Outlook Mail Merge</h3>
            <ol className="list-decimal pl-5 space-y-4 mb-8 text-[#444]">
              <li><strong>The Spreadsheet:</strong> Create an Excel file with columns: <code>FirstName</code>, <code>Email</code>, <code>Firm</code>, <code>CustomDetail</code>. (The custom detail is where you put that specific thing linking you to them).</li>
              <li><strong>The Document:</strong> Open Word. Go to Mailings → Start Mail Merge → Email Messages. Type your template here.</li>
              <li><strong>The Data:</strong> Go to Select Recipients → Use an Existing List. Select your Excel file.</li>
              <li><strong>Insert Fields:</strong> Highlight the placeholders in your template (e.g., [Name]) and click "Insert Merge Field". Select the corresponding column.</li>
              <li><strong>Send:</strong> Click "Finish & Merge" → "Send Email Messages". Make sure the "To" field is set to your Email column. Set the subject line and click OK.</li>
            </ol>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl my-8">
              <h4 className="text-lg font-bold text-red-900 mb-2 mt-0">Crucial Deliverability Tip</h4>
              <p className="m-0 text-red-800">
                Do not send more than 30 emails a day. Sending too many will trigger spam filters. <br/><br/>
                Additionally, ensure your LinkedIn profile is fully optimized before you send your first email. When you cold email someone, the first thing they do is search your name on LinkedIn.
              </p>
            </div>
          </section>

          <hr className="border-[#E8E8E8] my-12" />

          {/* Module 6 */}
          <section className="mb-16">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Module 6</p>
            <h2 className="text-3xl font-bold text-[#111] mb-6">What to Do After Sending</h2>
            <p>Most responses won't come from your first email. They come from the follow-up. 
            Decision makers are busy. Your email probably got buried. Following up shows persistence, not annoyance, as long as it's done respectfully.</p>

            <h3 className="text-xl font-bold text-[#111] mt-8 mb-3">The Golden Rule of Follow-ups</h3>
            <p className="text-lg italic text-[#555] border-l-2 border-[#CCC] pl-4">
              You should ALWAYS send exactly one follow-up. Wait 4-5 business days. Reply directly to your original email so the context is preserved.
            </p>

            <h3 className="text-xl font-bold text-[#111] mt-8 mb-4">Follow-up Template</h3>
            <div className="bg-white border border-[#E8E8E8] p-6 rounded-xl shadow-sm text-[#333] font-mono text-[15px] mb-8">
              <p>Hi [Name],</p>
              <p>Just floating this to the top of your inbox in case it got buried.</p>
              <p>I know you're busy, so completely understand if you don't have time right now. If there is a better time next month, please let me know.</p>
              <p>Best,<br/>[Your Name]</p>
            </div>

            <h3 className="text-xl font-bold text-[#111] mt-8 mb-4">Handling Responses</h3>
            <ul className="space-y-4 text-[#444]">
              <li><strong className="text-emerald-700">If they say yes:</strong> Reply immediately. Give them 3-4 specific times that you are free. Make it as frictionless as possible for them to say "Let's do Tuesday at 4pm".</li>
              <li><strong className="text-amber-600">If they say no / too busy:</strong> Reply politely thanking them for their time. Do not burn bridges. The industry is small.</li>
              <li><strong className="text-red-500">If they don't reply:</strong> Move on. Do not email them a third time. Focus your energy on the next 50 people on your list.</li>
            </ul>

            <div className="bg-[#111] text-white p-8 rounded-xl my-10 shadow-xl">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="text-emerald-400" /> Pre-Call Best Practices</h4>
              <ul className="space-y-3 text-white/80 list-disc pl-5">
                <li>Once a call is booked, send a calendar invite immediately. Include your phone number and a Zoom link.</li>
                <li>Prepare 5-7 highly specific questions. Do not ask things you can read on their website.</li>
                <li>Research recent deals their firm has done to show genuine commercial awareness.</li>
                <li>Practice your 60-second "Tell me about yourself" pitch. They will almost always ask this first.</li>
              </ul>
            </div>
          </section>

          {/* Final Thoughts */}
          <section className="bg-emerald-50 border-t border-emerald-200 mt-20 pt-16 -mx-6 px-6 md:-mx-8 md:px-8 rounded-b-3xl pb-16">
            <h2 className="text-3xl font-bold text-emerald-900 mb-6">Final Thoughts</h2>
            <p className="text-emerald-800 text-lg leading-relaxed mb-6">
              Cold emailing is a numbers game, but it's a numbers game played with high-quality inputs. The better your templates, your targeting, and your tracking, the higher your conversion rate will be.
            </p>
            <p className="text-emerald-800 text-lg leading-relaxed mb-8">
              Do not get discouraged by the silence. Every ignored email is just data. Tweak your subject lines, test new angles, and keep sending. <strong>The students who win are not the smartest. They are the most persistent. Good luck.</strong>
            </p>

            <div className="bg-white border border-emerald-200 rounded-2xl p-8 text-center mt-12 shadow-sm">
              <h3 className="text-xl font-bold text-[#111] mb-3">Need Help or More Templates?</h3>
              <p className="text-[#555] mb-6 max-w-lg mx-auto">
                If you want me to personally review your templates, look at your CV, or build your target firm list with you, book a Deep Dive Session. We will tear down your entire setup and rebuild it.
              </p>
              <Link 
                to="/portal/book-uthman"
                className="inline-flex items-center gap-2 bg-[#111] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#222] transition-colors"
              >
                Book a Deep Dive Session
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
