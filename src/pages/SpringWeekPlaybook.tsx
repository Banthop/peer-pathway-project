import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useSpringWeekAccess } from "@/components/spring-week-portal/SpringWeekPortalLayout";
import { SPEAKERS, SPRING_WEEK_TICKETS } from "@/data/springWeekData";
import {
  BookOpen,
  Lock,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Building2,
  Lightbulb,
  Target,
  AlertCircle,
} from "lucide-react";

/* ---------------------------------------------------------------
   Chapter data: one per speaker firm
--------------------------------------------------------------- */
interface PlaybookChapter {
  firm: string;
  category: string;
  teaser: string;
  sections: {
    title: string;
    icon: React.ElementType;
    preview: string;
    fullContent: string;
  }[];
}

const CHAPTERS: PlaybookChapter[] = [
  {
    firm: "Citi",
    category: "Investment Banking",
    teaser:
      "The one thing most spring weekers overlook in their first week that makes conversion nearly impossible to recover from.",
    sections: [
      {
        title: "What the programme involved",
        icon: Building2,
        preview:
          "A 4-week rotation across two desks with formal mid-week check-ins...",
        fullContent:
          "The Citi spring week runs across four weeks with structured desk rotations. You sit on two different desks across the programme, each for roughly two weeks. Mid-programme you have a formal check-in with HR and your desk supervisor. The final week includes a group presentation task judged by MDs. Day-to-day involves shadowing analysts, attending team meetings, and completing small research tasks set by the team.",
      },
      {
        title: "Insider tips",
        icon: Lightbulb,
        preview:
          "The analysts remember who asked smart questions. The MDs remember who sent a follow-up...",
        fullContent:
          "The single most effective thing you can do is treat every analyst like a future reference. Send a LinkedIn message after your first conversation with every person you sit next to. Keep them short. Reference something specific from the conversation. Analysts talk to each other and they talk to HR. Your reputation is built in week one. The presentation in the final week is less about the content and more about how you handle pressure questions from MDs. Prepare for pushback, not just delivery.",
      },
      {
        title: "How to convert",
        icon: Target,
        preview:
          "Return offers are not given to the best analysts. They are given to the people HR can argue for...",
        fullContent:
          "The conversion decision at Citi is made partly by the desk you sat on and partly by HR. The desk gives a performance rating. HR decides whether you fit the culture. The desk can rate you highly and HR can still block the offer if you came across as difficult or if you gave inconsistent answers in feedback sessions. The safest strategy is consistent, low-drama visibility. Show up early, stay slightly late on key days, and always have one prepared question for every meeting you attend. Book a coffee with your HR contact before the final week. Ask them directly what a strong candidate looks like at this stage.",
      },
      {
        title: "Mistakes to avoid",
        icon: AlertCircle,
        preview:
          "The two mistakes that ruled out candidates who were otherwise performing well...",
        fullContent:
          "First: over-networking with senior people at the expense of relationships with analysts. Analysts are asked directly by HR which spring weekers they enjoyed working with. Second: treating the group presentation as an individual performance. The groups that converted the most had people who clearly listened to each other. If an MD asks your colleague a question, do not jump in with your own answer. Let them answer, then add to it. This signals maturity and self-awareness, which is exactly what banks want in someone they are considering keeping.",
      },
    ],
  },
  {
    firm: "Barclays",
    category: "Investment Banking",
    teaser:
      "Why Barclays spring week decisions are made in the first 48 hours, and what you can do about it.",
    sections: [
      {
        title: "What the programme involved",
        icon: Building2,
        preview:
          "Structured rotations across CIB divisions with a case study competition in week three...",
        fullContent:
          "The Barclays spring week spans three weeks within the Corporate and Investment Bank. You rotate through different divisions and spend time with both graduate analysts and senior staff. Week three includes a competitive case study exercise where groups present to a panel. There are also formal skills sessions covering financial modelling basics, presentation skills, and the graduate recruitment process.",
      },
      {
        title: "Insider tips",
        icon: Lightbulb,
        preview:
          "Everyone prepares for the case study. Almost nobody prepares for the skills sessions...",
        fullContent:
          "The skills sessions are underrated as conversion opportunities. Recruiters attend them and watch who is engaged versus who is coasting. Sit in the front half of the room. Ask at least one question per session. Connect what is covered in skills sessions to things you have observed on desk that week. This creates a narrative that you are paying attention to the whole programme, not just the performance tasks. On the case study, volunteer to present the section your group is least confident in. Taking ownership of the hard part is remembered.",
      },
      {
        title: "How to convert",
        icon: Target,
        preview:
          "The Barclays conversion process has a specific checkpoint most spring weekers do not know exists...",
        fullContent:
          "Barclays runs an informal mid-programme check-in where desk supervisors share notes on spring weekers. This is not communicated to you but it happens. By the end of week two your reputation on desk is essentially set. The spring weekers who convert are almost always the ones who had a strong week two on their second rotation. First rotations give you one data point. Second rotations are where you implement what you learned and show you can adapt. Treat the second rotation as a performance improvement on the first.",
      },
      {
        title: "Mistakes to avoid",
        icon: AlertCircle,
        preview:
          "The mistake that looks like enthusiasm but reads as immaturity to senior bankers...",
        fullContent:
          "Sending too many unsolicited ideas or opinions to senior staff during the programme. Spring weekers who email MDs with market commentary or unsolicited analysis almost always damage their chances. The bar for that kind of initiative is much higher than you think. Focus on executing the tasks you are given exceptionally well before you volunteer anything additional. The other mistake is underperforming in the case study because you assumed your desk performance was strong enough. It is not. Every part of the programme is evaluated independently.",
      },
    ],
  },
  {
    firm: "Optiver",
    category: "Trading / Quant",
    teaser:
      "Trading firm spring weeks are assessed differently from banking. Here is what the Optiver evaluators are actually testing.",
    sections: [
      {
        title: "What the programme involved",
        icon: Building2,
        preview:
          "A shorter, intensive programme focused on technical challenges and trading simulations...",
        fullContent:
          "The Optiver spring week is more intensive and technically focused than typical banking programmes. It runs for one week and includes trading simulations, probability and numeracy sessions, and a group market-making challenge. You sit alongside graduate traders and get direct exposure to how the desk operates in real time. There is less rotation and more depth. The programme is designed to stress-test analytical thinking under time pressure.",
      },
      {
        title: "Insider tips",
        icon: Lightbulb,
        preview:
          "The market-making challenge is not about getting the right price. It is about something else entirely...",
        fullContent:
          "In the market-making challenge, evaluators care less about whether your prices are accurate and more about whether you adjust quickly when given new information. The spring weekers who impress show that they can update their mental model fast and communicate their reasoning clearly under pressure. Verbalize your thinking during exercises. Do not work silently. Traders want to see how you process information, not just what answer you reach. Prepare mental arithmetic beforehand. Speed matters and you will not have time to use pen and paper for everything.",
      },
      {
        title: "How to convert",
        icon: Target,
        preview:
          "Conversion at a prop trading firm depends on a different set of signals than banking...",
        fullContent:
          "Optiver and similar firms convert based on a combination of your technical performance during the programme and cultural fit signals. Cultural fit here means: are you competitive in a healthy way, do you show intellectual curiosity, and do you handle being wrong gracefully? The interview-style debrief at the end of the week is critical. Practice explaining your reasoning on the simulations. Do not pretend you did not make mistakes. Acknowledge them and explain what you would do differently. This is more impressive than a polished answer that avoids accountability.",
      },
      {
        title: "Mistakes to avoid",
        icon: AlertCircle,
        preview:
          "Why the spring weekers with the highest raw scores do not always get offers...",
        fullContent:
          "Being too focused on your individual score at the expense of team dynamics. In the group exercises, the evaluators are watching how you collaborate, not just how fast you are. Spring weekers who dominate every exercise and ignore their group members typically do not convert even if their individual performance is strong. The other mistake is failing to research the firm's trading strategies before the programme. Optiver expects you to know what they do and to be genuinely interested in it. Generic enthusiasm reads as a lack of preparation.",
      },
    ],
  },
  {
    firm: "Jefferies",
    category: "Investment Banking",
    teaser:
      "What makes a Jefferies spring week different from bulge bracket programmes, and how to use that difference to your advantage.",
    sections: [
      {
        title: "What the programme involved",
        icon: Building2,
        preview:
          "A more intimate programme with direct access to senior bankers that larger banks rarely offer...",
        fullContent:
          "The Jefferies spring week is smaller than comparable programmes at larger banks. This means more direct access to MDs and less competition for face time with senior staff. You will attend client-facing meetings as an observer and get involved in live deal support in a limited capacity. There are structured networking events each week and a final presentation to a panel of bankers.",
      },
      {
        title: "Insider tips",
        icon: Lightbulb,
        preview:
          "The smaller cohort means your individual impression carries more weight than at a bulge bracket...",
        fullContent:
          "Because the cohort is small, every person in the room knows who you are by week two. There is nowhere to hide but also nowhere to be overlooked. Prepare a short personal narrative before the programme starts. Know how you will answer: why finance, why Jefferies, and what you want to do after the spring week. You will be asked these questions in informal settings, not just formal interviews. Rehearse conversational answers, not formal interview answers.",
      },
      {
        title: "How to convert",
        icon: Target,
        preview:
          "The Jefferies conversion decision relies heavily on one specific factor that surprises most spring weekers...",
        fullContent:
          "At Jefferies the strongest predictor of a conversion offer is whether you built a genuine relationship with at least one MD or VP during the programme. This is more achievable than it sounds because the smaller cohort gives you access. Identify the senior person you click with most naturally and invest in that relationship. Follow up on conversations, ask them to grab coffee once during the programme, and reference specific things they said in your final presentation. Referrals from within the bank carry significant weight in the conversion decision.",
      },
      {
        title: "Mistakes to avoid",
        icon: AlertCircle,
        preview:
          "Treating Jefferies like a Goldman or JPMorgan programme is the fastest way to not convert...",
        fullContent:
          "Do not approach Jefferies as if the goal is to blend in and avoid making mistakes. The culture rewards initiative and directness. Spring weekers who wait to be told what to do are noticed for the wrong reasons. Proactively ask for more work when you finish a task. Tell your desk supervisor what you are interested in and ask if there is anything relevant you could help with. The other mistake is underestimating the final presentation. At smaller firms the presentation carries more weight in the final decision than at larger banks where your daily performance is more heavily weighted.",
      },
    ],
  },
  {
    firm: "Nomura",
    category: "Investment Banking",
    teaser:
      "Nomura's spring week culture is distinct from American banks. Understanding that distinction is half the battle.",
    sections: [
      {
        title: "What the programme involved",
        icon: Building2,
        preview:
          "A structured four-week programme with a strong emphasis on cross-divisional exposure...",
        fullContent:
          "Nomura's spring week covers multiple divisions including investment banking, markets, and support functions. There is a deliberate emphasis on understanding how the different parts of the business connect. Week-long rotations are standard with formal check-ins at the end of each. There are external speaker sessions with clients and industry practitioners, and a group project that runs across the full programme.",
      },
      {
        title: "Insider tips",
        icon: Lightbulb,
        preview:
          "The cross-divisional emphasis is a conversion signal, not just a learning exercise...",
        fullContent:
          "Nomura values spring weekers who demonstrate awareness of the wider business. Show in conversations that you understand how your desk's work fits into the broader firm strategy. Reference things you observed in other divisions. This signals maturity and commercial awareness, both of which are explicitly rated in Nomura's evaluation framework. The group project is a genuine differentiator. Teams that present commercially coherent recommendations with realistic implementation challenges consistently outperform teams that focus only on the financial mechanics.",
      },
      {
        title: "How to convert",
        icon: Target,
        preview:
          "Conversion at Nomura involves a factor most spring weekers do not account for during the programme...",
        fullContent:
          "Nomura places weight on how you interact with support staff and non-banking teams during the programme. The culture is less hierarchical than some American banks and the firm notices spring weekers who treat every person in the building with the same level of respect. Assistants, operations staff, and compliance teams are all part of the picture. Spring weekers who only network upward tend to get weaker feedback in the cultural assessment. Make a point of having real conversations with people at every level during your rotations.",
      },
      {
        title: "Mistakes to avoid",
        icon: AlertCircle,
        preview:
          "The common misconception about Nomura's culture that costs spring weekers their offer...",
        fullContent:
          "The biggest mistake is assuming Nomura operates like a US bulge bracket. The communication style is different. More direct criticism of ideas is acceptable in internal meetings. Spring weekers who deflect or get defensive when their work is challenged come across as lacking resilience. When your work is critiqued, engage with the critique directly. Ask what the stronger version of your analysis would look like. Show that you can take feedback and implement it quickly. This is consistently flagged as a positive signal in conversion conversations.",
      },
    ],
  },
  {
    firm: "Morgan Stanley",
    category: "Investment Banking",
    teaser:
      "Morgan Stanley's spring week is one of the most competitive in the sector. Here is what the top converters did differently.",
    sections: [
      {
        title: "What the programme involved",
        icon: Building2,
        preview:
          "A highly structured programme with formal evaluations at multiple checkpoints throughout the month...",
        fullContent:
          "Morgan Stanley runs a four-week spring week with clear milestones. There are formal check-ins at the end of weeks one, two, and four. You rotate through divisions assigned to you at the start of the programme. The final week includes a formal case study exercise and a recruiter interview. Networking events are structured and semi-formal rather than the casual drinks format used at some banks.",
      },
      {
        title: "Insider tips",
        icon: Lightbulb,
        preview:
          "Most spring weekers prepare for the end-of-programme interview. The check-ins at weeks one and two matter just as much...",
        fullContent:
          "The week one check-in at Morgan Stanley is used to flag any concerns early. It is also an opportunity to make a strong first impression with the recruiter assigned to you. Treat it as a mini interview, not a casual chat. Have specific observations about your first week prepared. Mention one thing you found challenging and what you did to address it. This signals self-awareness. For week two, the recruiter is comparing notes with your desk supervisors. Make sure your desk supervisor knows your name and has a positive opinion of you before that check-in happens.",
      },
      {
        title: "How to convert",
        icon: Target,
        preview:
          "The spring weekers who converted at Morgan Stanley shared one non-obvious trait...",
        fullContent:
          "The spring weekers who converted consistently demonstrated that they understood what analysts actually do day to day, not just the surface-level version. Before the programme, spend time on forums and speaking to analysts about the reality of the first two years. Then, during the programme, show that you understand what you are signing up for. When bankers sense that a spring weeker genuinely understands the job, they become advocates. When they sense a spring weeker has a romanticised view of it, they become cautious about recommending them.",
      },
      {
        title: "Mistakes to avoid",
        icon: AlertCircle,
        preview:
          "The mistake that costs spring weekers their offer in the final interview...",
        fullContent:
          "Going into the final interview having not reviewed your case study performance critically. The most common failure in the Morgan Stanley final interview is when a spring weeker cannot discuss the weaknesses in their own case study presentation. The interviewers expect you to know where your group's analysis fell short and to have a view on how it could have been strengthened. Spring weekers who defend everything they presented come across as lacking analytical rigour. Those who identify weaknesses and explain the stronger version of the analysis consistently receive better feedback.",
      },
    ],
  },
  {
    firm: "Millennium",
    category: "Trading / Quant",
    teaser:
      "What Millennium Management is actually assessing during their spring week, and why most applicants misread the brief.",
    sections: [
      {
        title: "What the programme involved",
        icon: Building2,
        preview:
          "An intensive programme with exposure to multiple pods and a strong quantitative component...",
        fullContent:
          "The Millennium spring week provides exposure to the multi-strategy hedge fund environment. You interact with different investment pods and get an overview of how each operates independently within the firm's umbrella. There are quantitative challenge sessions, risk management workshops, and exposure to technology and operations teams. The programme is smaller than investment banking equivalents and the evaluation is more continuous than event-based.",
      },
      {
        title: "Insider tips",
        icon: Lightbulb,
        preview:
          "Hedge fund spring weeks reward a different kind of intellectual behaviour than banking programmes...",
        fullContent:
          "At Millennium the evaluators are looking for genuine intellectual curiosity about markets and quantitative methods. The spring weekers who stand out are the ones who ask specific, informed questions about how individual pods construct their strategies. Generic questions about culture or career paths do not impress here. Come prepared with knowledge of at least two or three specific strategies the firm is known for and have real questions about the execution of those strategies. Show that you have thought about the problems they are solving, not just the prestige of the brand.",
      },
      {
        title: "How to convert",
        icon: Target,
        preview:
          "Conversion at a multi-strategy hedge fund involves factors that banking-focused spring weekers often miss...",
        fullContent:
          "Conversion at Millennium depends heavily on whether a specific pod wants to extend an offer, which makes the networking component more important than the programme-level assessment. Identify the pod that aligns with your quantitative interests and invest time in building a relationship with one or two people in that team. Ask if there is any analytical work you could help with during your time there. Even small contributions to a real task are remembered. Theoretical enthusiasm is easy. Showing that you can apply your skills to actual problems is rare.",
      },
      {
        title: "Mistakes to avoid",
        icon: AlertCircle,
        preview:
          "The mindset that works for banking spring weeks actively works against you at hedge funds...",
        fullContent:
          "Trying to be universally likeable across the whole programme rather than deeply valuable to specific teams. Hedge fund culture rewards depth over breadth. The spring weeker who becomes genuinely useful to one pod during two weeks will convert ahead of the one who spread themselves across every team trying to make a good impression on everyone. Also avoid presenting yourself as primarily interested in the prestige or the earning potential. Evaluators at hedge funds are highly attuned to whether candidates are genuinely interested in the intellectual problems or just chasing the name on a CV.",
      },
    ],
  },
  {
    firm: "PwC",
    category: "Consulting / Big 4",
    teaser:
      "PwC's spring week is one of the highest conversion rate programmes in the sector. Here is exactly how to make sure you are in that group.",
    sections: [
      {
        title: "What the programme involved",
        icon: Building2,
        preview:
          "A structured two-week programme covering multiple service lines with client case simulations...",
        fullContent:
          "The PwC spring week runs for two weeks and covers multiple service lines including advisory, assurance, and tax. You rotate between teams and participate in client case simulations, presentations to partners, and structured networking sessions. There are formal skills workshops covering commercial awareness, problem structuring, and communication. The programme culminates in a group presentation judged by senior staff.",
      },
      {
        title: "Insider tips",
        icon: Lightbulb,
        preview:
          "PwC's conversion rates are high but not guaranteed. What separates the converters is not performance in the case simulations...",
        fullContent:
          "The formal case simulations are important but they are not the main conversion driver. The partners who observe the programme pay attention to how spring weekers interact with each other, with staff, and with clients in informal settings. Commercial awareness conversations during lunch or networking drinks carry more weight than most spring weekers expect. Prepare three strong commercial topics before the programme starts. UK and global business news, sector trends relevant to PwC service lines, and at least one major regulatory change affecting the clients PwC serves.",
      },
      {
        title: "How to convert",
        icon: Target,
        preview:
          "The specific signal PwC partners look for that most spring weekers do not know about...",
        fullContent:
          "PwC partners look for spring weekers who demonstrate client empathy. This means understanding that the client's problem is not always the problem that gets presented to you. In the case simulations and group exercises, show that you are thinking about the human and organisational dimensions of the challenge, not just the technical solution. Spring weekers who present only data-driven recommendations without addressing implementation realities consistently receive lower scores from partners. The strongest candidates acknowledge constraints, manage expectations, and frame recommendations in terms of what is achievable for the client.",
      },
      {
        title: "Mistakes to avoid",
        icon: AlertCircle,
        preview:
          "The presentation style that reads well to students but badly to Big 4 partners...",
        fullContent:
          "Over-engineering your presentations. Spring weekers who load slides with data, frameworks, and detail signal that they are trying to impress rather than communicate. Partners value clarity. The most impressive spring week presentations are simple, structured, and tell a clear story. One recommendation, clearly justified, with a realistic implementation roadmap, will outperform a comprehensive analysis that lacks a clear point of view. Practice cutting your presentations down rather than adding to them.",
      },
    ],
  },
  {
    firm: "Citadel",
    category: "Trading / Quant",
    teaser:
      "Citadel's spring week is intensely competitive and technically demanding. Here is what the top performers understood going in.",
    sections: [
      {
        title: "What the programme involved",
        icon: Building2,
        preview:
          "A one-week intensive with heavy quantitative assessment and direct trading floor exposure...",
        fullContent:
          "The Citadel spring week is short and extremely focused. The programme includes quantitative assessments, trading floor exposure, case studies focused on risk and portfolio construction, and direct sessions with senior quants and traders. The cohort is small and the evaluation is continuous rather than based on a single assessment event. Every interaction is part of the picture.",
      },
      {
        title: "Insider tips",
        icon: Lightbulb,
        preview:
          "The quant sessions at Citadel are designed to find how you reason under uncertainty, not just whether you know the answer...",
        fullContent:
          "The quant sessions deliberately include problems with incomplete information. Evaluators are watching whether you ask clarifying questions, make your assumptions explicit, and check your reasoning at each step. Candidates who give fast confident answers to ambiguous problems without acknowledging the ambiguity are penalised. Slow down, state what you are assuming, and walk through your logic step by step. This is more impressive than a correct answer delivered without explanation.",
      },
      {
        title: "How to convert",
        icon: Target,
        preview:
          "What the Citadel evaluators care about beyond the quantitative performance...",
        fullContent:
          "Technical performance is the filter but intellectual curiosity is the differentiator. After you pass the technical bar, the question becomes whether you are genuinely excited by the problems Citadel works on. Prepare specific questions about their quantitative strategies and be ready to have a real technical conversation. Spring weekers who can engage with evaluators as intellectual peers on topics related to the firm's work convert significantly ahead of those who can only demonstrate that they revised their probability and statistics.",
      },
      {
        title: "Mistakes to avoid",
        icon: AlertCircle,
        preview:
          "Why preparing the same way as for a banking spring week will leave you underprepared for Citadel...",
        fullContent:
          "The biggest mistake is treating Citadel's spring week as a networking exercise with some technical tests attached. It is the other way around. The technical assessment is primary and the networking is secondary. Spend the majority of your preparation time on quantitative problem solving, probability, and basic programming concepts. Revise mental arithmetic. Practice under time pressure. If you show up having prepared your personal brand but not your technical foundations, you will not make it past the first day's sessions.",
      },
    ],
  },
  {
    firm: "Bank of America",
    category: "Investment Banking",
    teaser:
      "Bank of America's spring week rewards a specific kind of professionalism that many candidates miss until it is too late.",
    sections: [
      {
        title: "What the programme involved",
        icon: Building2,
        preview:
          "A structured four-week programme with clear divisional tracks and formal midpoint reviews...",
        fullContent:
          "Bank of America's spring week runs for four weeks with divisional tracks assigned at the start. You rotate within your track rather than across the whole bank. There are formal midpoint reviews at week two and a final panel presentation in the last week. The programme includes external speaker sessions, analyst Q&As, and structured networking events across all participant cohorts.",
      },
      {
        title: "Insider tips",
        icon: Lightbulb,
        preview:
          "The divisional track structure means your comparison group is smaller than you think...",
        fullContent:
          "Because Bank of America assigns divisional tracks at the start, you are being compared to a cohort of ten to fifteen people rather than the full spring week intake. This makes individual impressions carry more weight. Identify the strongest two or three people in your track early and position yourself relative to them. Understand what they are doing well and make sure your own approach is distinct rather than imitative. Being the second-best version of someone else is not a conversion strategy.",
      },
      {
        title: "How to convert",
        icon: Target,
        preview:
          "The relationship you need to build in week one that most spring weekers leave until week three...",
        fullContent:
          "At Bank of America the analyst buddy assigned to you at the start of the programme has more influence over your conversion than most spring weekers realise. They submit formal feedback and are asked direct questions about which spring weekers they would want on their team. Invest in this relationship from day one. Show genuine interest in their career path. Ask them what they wish they had known before their spring week. Help them with tasks they give you without being asked to, and deliver work that requires minimal revision.",
      },
      {
        title: "Mistakes to avoid",
        icon: AlertCircle,
        preview:
          "The administrative failure that has prevented otherwise strong candidates from converting...",
        fullContent:
          "Missing deadlines or submitting work late during the programme. Bank of America operates with tight timelines and the culture treats deadline management as a proxy for reliability. Spring weekers who submit work late even once develop a reputation for unreliability that is very hard to reverse. If you are going to miss a deadline for any reason, communicate proactively before the deadline, not after. Senior bankers will always prefer an early warning over a silent miss.",
      },
    ],
  },
  {
    firm: "Forbes",
    category: "Media / Other",
    teaser:
      "What a non-finance spring week looks like from the inside, and how the conversion signals differ from banking programmes.",
    sections: [
      {
        title: "What the programme involved",
        icon: Building2,
        preview:
          "A content and commercial programme spanning editorial, commercial partnerships, and digital strategy...",
        fullContent:
          "The Forbes spring week programme is structured differently from finance-focused programmes. It spans editorial, brand partnerships, and digital strategy. You work on live briefs alongside the commercial team, contribute to content projects, and participate in strategy workshops. There are sessions with senior staff across all business functions and a group project that results in a pitch to leadership.",
      },
      {
        title: "Insider tips",
        icon: Lightbulb,
        preview:
          "The skills that impress in a media and publishing spring week are almost the opposite of what works in banking...",
        fullContent:
          "Creativity and clear writing are evaluated explicitly. Come prepared with examples of commercial writing or content you have created. Even student publications or personal projects count. The evaluators are looking for people who can form a clear point of view and communicate it concisely. For the commercial sessions, show that you understand how the business makes money and who the clients are. Candidates who only engage with the editorial side without understanding the commercial structure come across as naive about how media businesses actually operate.",
      },
      {
        title: "How to convert",
        icon: Target,
        preview:
          "The pitch to leadership at the end of the programme is a genuine make-or-break moment...",
        fullContent:
          "The final pitch is the highest-weighted single event in the programme. Treat it as a real business proposal, not a student exercise. Research Forbes's commercial positioning, understand the competitive landscape, and make sure your recommendation is grounded in how the business actually operates today. The teams that impress are the ones that show they understand the constraints the business operates under and have designed a solution that works within them. Generic creative ideas without commercial grounding do not convert.",
      },
      {
        title: "Mistakes to avoid",
        icon: AlertCircle,
        preview:
          "The mistake that is specific to media spring weeks and almost never comes up in finance...",
        fullContent:
          "Not having a strong online presence or portfolio before the programme. In a media and publishing context, the people assessing you will look at your LinkedIn, any public writing, and your general digital footprint. If your online presence does not reflect the kind of commercial and intellectual maturity they are looking for, it will raise questions about your fit. Update your LinkedIn before the programme starts. Make sure any public writing you have represents you well. This is not vanity. It is professionalism in an industry where your voice and output are the product.",
      },
    ],
  },
];

/* ---------------------------------------------------------------
   Locked overlay component
--------------------------------------------------------------- */
function LockedOverlay({
  onCtaClick,
}: {
  onCtaClick: () => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-b-xl z-10 px-6 py-8 text-center">
      <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4">
        <Lock className="w-5 h-5 text-[#999]" />
      </div>
      <p className="text-[14px] font-semibold text-[#111] mb-1">
        Full chapter locked
      </p>
      <p className="text-[12px] text-[#888] font-light leading-relaxed mb-5 max-w-[240px]">
        Unlock all chapters with the Bundle or Premium ticket.
      </p>
      <button
        onClick={onCtaClick}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111] text-white text-[13px] font-semibold hover:bg-[#222] transition-colors"
      >
        Unlock Playbook
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------
   Chapter card
--------------------------------------------------------------- */
function ChapterCard({
  chapter,
  index,
  hasAccess,
  onCtaClick,
}: {
  chapter: PlaybookChapter;
  index: number;
  hasAccess: boolean;
  onCtaClick: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(null);

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden">
      {/* Chapter header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FAFAFA] transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-[13px] font-bold text-[#888] flex-shrink-0">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[14px] font-semibold text-[#111]">
                {chapter.firm}
              </p>
              <span className="text-[10px] font-medium text-[#999] bg-[#F5F5F5] px-2 py-0.5 rounded-full">
                {chapter.category}
              </span>
              {hasAccess && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Unlocked
                </span>
              )}
              {!hasAccess && (
                <span className="text-[10px] font-medium text-[#BBB] bg-[#F5F5F5] border border-[#E8E8E8] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Locked
                </span>
              )}
            </div>
            <p className="text-[12px] text-[#888] font-light mt-0.5 leading-relaxed">
              {chapter.teaser}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-[#BBB]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#BBB]" />
          )}
        </div>
      </button>

      {/* Expanded sections */}
      {expanded && (
        <div className="border-t border-[#E8E8E8] relative">
          <div className="divide-y divide-[#F5F5F5]">
            {chapter.sections.map((section, sIdx) => {
              const Icon = section.icon;
              const isOpen = openSection === sIdx;

              return (
                <div key={sIdx}>
                  <button
                    onClick={() => setOpenSection(isOpen ? null : sIdx)}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#999] flex-shrink-0" />
                      <span className="text-[13px] font-medium text-[#333]">
                        {section.title}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#CCC] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#CCC] flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4">
                      {hasAccess ? (
                        <p className="text-[13px] text-[#555] font-light leading-relaxed pl-7">
                          {section.fullContent}
                        </p>
                      ) : (
                        <div className="pl-7">
                          <p className="text-[13px] text-[#888] font-light leading-relaxed mb-3 italic">
                            {section.preview}
                          </p>
                          <div className="flex items-center gap-2 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg px-3 py-2.5">
                            <Lock className="w-3.5 h-3.5 text-[#CCC] flex-shrink-0" />
                            <p className="text-[11px] text-[#BBB] font-light">
                              Full content unlocked with Bundle or Premium ticket.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Blurred locked state overlay for non-buyers when chapter is expanded */}
          {!hasAccess && (
            <div className="px-5 py-4 bg-gradient-to-b from-transparent to-[#FAFAFA] border-t border-[#E8E8E8]">
              <button
                onClick={onCtaClick}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#111] text-white text-[13px] font-semibold hover:bg-[#222] transition-colors"
              >
                Unlock full chapter
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   Purchase CTA section
--------------------------------------------------------------- */
function PurchaseCTA() {
  return (
    <div
      id="purchase-cta"
      className="bg-gradient-to-br from-[#111] to-[#1a1a2e] rounded-2xl p-8 text-white"
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50 mb-2">
        Unlock The Playbook
      </p>
      <h2 className="text-xl font-semibold mb-2">
        Get the full Spring Week Playbook
      </h2>
      <p className="text-[13px] text-white/60 font-light leading-relaxed mb-6 max-w-lg">
        All 11 chapters, fully unlocked. Every firm covered in depth. Written
        by students who completed spring weeks and converted. Included in the
        Bundle and Premium tickets.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[14px] font-semibold">Bundle</p>
            <p className="text-[18px] font-bold">29</p>
          </div>
          <p className="text-[12px] text-white/50 font-light leading-relaxed mb-3">
            Both live panel sessions + The Spring Week Playbook + recordings
          </p>
          <ul className="space-y-1.5 mb-4">
            {[
              "Part 1 live panel",
              "Part 2 live panel",
              "The Spring Week Playbook",
              "Recordings of both sessions",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-[12px] text-white/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <a
            href={SPRING_WEEK_TICKETS.bundle.stripeLink}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-[13px] font-semibold transition-colors"
          >
            Get Bundle
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="bg-white/5 border border-amber-400/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[14px] font-semibold">Premium</p>
            <p className="text-[18px] font-bold">49</p>
          </div>
          <p className="text-[12px] text-white/50 font-light leading-relaxed mb-3">
            Everything in Bundle plus a 1-on-1 coaching session with a panellist
          </p>
          <ul className="space-y-1.5 mb-4">
            {[
              "Everything in Bundle",
              "1-on-1 coaching session",
              "Personalised spring week strategy",
              "Priority Q&A at live sessions",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-[12px] text-white/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <a
            href={SPRING_WEEK_TICKETS.premium.stripeLink}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-[13px] font-semibold transition-colors"
          >
            Get Premium
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <p className="text-[11px] text-white/30 font-light text-center">
        Instant access after purchase. Playbook chapters unlock immediately.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------
   Main page
--------------------------------------------------------------- */
export default function SpringWeekPlaybook() {
  useEffect(() => {
    document.title = "The Spring Week Playbook | EarlyEdge";
    const metaDescription = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (metaDescription) {
      metaDescription.content =
        "Firm-by-firm insider guides written by students who completed spring weeks and converted. Covers what each programme involved, how to convert, and the mistakes that cost other candidates their offers.";
    }
    return () => {
      document.title = "Early Edge";
      if (metaDescription) {
        metaDescription.content =
          "Book 1-on-1 coaching sessions with students and recent grads who just achieved what you're aiming for.";
      }
    };
  }, []);

  const { user, loading: authLoading } = useAuth();
  const access = useSpringWeekAccess();

  const hasAccess = access.hasPlaybook;
  const isLoading = authLoading || (user !== null && access.loading);

  const scrollToCta = () => {
    const el = document.getElementById("purchase-cta");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-20 pb-16">
        {/* Hero */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-10 pb-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#111] flex items-center justify-center flex-shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#999] mb-1">
                Spring Week Conversion Panel
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111]">
                The Spring Week Playbook
              </h1>
            </div>
          </div>

          <p className="text-[15px] text-[#666] font-light leading-relaxed max-w-2xl mb-6">
            Insider guides from students who completed spring weeks and
            converted into return offers and summer internships. Firm-by-firm
            breakdowns covering what each programme involved, insider tips, how
            to convert, and the mistakes that cost other candidates their
            offers.
          </p>

          {/* Access state indicator */}
          {hasAccess ? (
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-semibold px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Full access unlocked
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="inline-flex items-center gap-2 bg-[#F5F5F5] border border-[#E8E8E8] text-[#888] text-[12px] font-medium px-3 py-1.5 rounded-full">
                <Lock className="w-3.5 h-3.5" />
                Preview mode
              </div>
              <button
                onClick={scrollToCta}
                className="inline-flex items-center gap-2 bg-[#111] text-white text-[12px] font-semibold px-4 py-1.5 rounded-full hover:bg-[#222] transition-colors"
              >
                Unlock Playbook
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 mb-8">
          <div className="grid grid-cols-3 gap-4 bg-white border border-[#E8E8E8] rounded-xl px-6 py-4">
            <div className="text-center">
              <p className="text-[22px] font-bold text-[#111]">
                {CHAPTERS.length}
              </p>
              <p className="text-[11px] text-[#888] font-light mt-0.5">
                Chapters
              </p>
            </div>
            <div className="text-center border-x border-[#E8E8E8]">
              <p className="text-[22px] font-bold text-[#111]">4</p>
              <p className="text-[11px] text-[#888] font-light mt-0.5">
                Sections per chapter
              </p>
            </div>
            <div className="text-center">
              <p className="text-[22px] font-bold text-[#111]">11</p>
              <p className="text-[11px] text-[#888] font-light mt-0.5">
                Firms covered
              </p>
            </div>
          </div>
        </div>

        {/* Table of contents label */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#111]">
              Chapters
            </h2>
            <p className="text-[12px] text-[#999] font-light">
              Click any chapter to preview
            </p>
          </div>
        </div>

        {/* Chapter list */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-3 mb-12">
          {CHAPTERS.map((chapter, idx) => (
            <ChapterCard
              key={chapter.firm}
              chapter={chapter}
              index={idx}
              hasAccess={hasAccess}
              onCtaClick={scrollToCta}
            />
          ))}
        </div>

        {/* Purchase CTA (shown to non-buyers) */}
        {!hasAccess && (
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <PurchaseCTA />
          </div>
        )}

        {/* Portal link (shown to buyers) */}
        {hasAccess && (
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[#111] mb-1">
                  Go to your portal
                </p>
                <p className="text-[13px] text-[#888] font-light">
                  Access your live sessions, recordings, and coaching booking.
                </p>
              </div>
              <Link
                to="/spring-week-portal"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111] text-white text-[13px] font-semibold hover:bg-[#222] transition-colors flex-shrink-0"
              >
                My Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
