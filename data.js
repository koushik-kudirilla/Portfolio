/* ==========================================================================
   EDITABLE CONTENT
   Everything you'll want to change (text, dates, links, projects) lives in
   this one file. index.html and script.js just read from this object.

   To add a project: copy an existing object inside `projects` and edit it.
   To change the accent color: see style.css, the `:root` block at the top.
   ========================================================================== */

const PORTFOLIO_DATA = {

  /* ------------------------------------------------------------------ */
  /* PERSONAL — public fields only. Sensitive fields (DOB, address,     */
  /* father's name, gender, marital status, membership ID) are kept    */
  /* here for your records but are intentionally NOT rendered anywhere */
  /* in index.html/script.js. Add them to the DOM yourself if you ever */
  /* want them shown.                                                   */
  /* ------------------------------------------------------------------ */
  personal: {
    name: "Koushik Kudirilla",
    headline: "Software Development · Applied AI/ML · IoT",
    summary: "Seeking an opportunity to apply my software development, applied AI/ML, and IoT skills to build reliable, practical solutions while continuing to grow as an engineer.",
    location: "Visakhapatnam, Andhra Pradesh, India",
    email: "koushikkudirilla@gmail.com",
    phone: "+91 9392148628", // shown only in Contact section
    // Path to your resume PDF. Add the file to assets/ and update this path;
    // set `resumeAvailable: false` to hide the Download Resume button entirely.
    resumeUrl: "assets/resume.pdf",
    resumeAvailable: true,
    // --- PRIVATE, not rendered ---
    _private: {
      fathersName: "Prem Kumar Kudirilla",
      dob: "13-05-2005",
      address: "D.No.22-81-16/5, Visakhapatnam, AP – 530001",
      gender: "Male",
      maritalStatus: "Single",
      membershipId: "1801071",
      declaration: {
        text: "I hereby declare that the information provided above is true and correct to the best of my knowledge.",
        place: "Visakhapatnam",
        date: "15-08-2026"
      }
    }
  },

  /* ------------------------------------------------------------------ */
  /* SOCIAL / TECHNICAL PROFILES                                        */
  /* ------------------------------------------------------------------ */
  profiles: {
    github: { label: "GitHub", url: "https://github.com/koushik-kudirilla" },
    linkedin: { label: "LinkedIn", url: "https://linkedin.com/in/koushikkudirilla" },
    hackerrank: { label: "HackerRank", url: "https://hackerrank.com/koushikkudirilla" },
    leetcode: { label: "LeetCode", url: "https://leetcode.com/koushik_kudirilla", verified: true }
  },

  /* ------------------------------------------------------------------ */
  /* PAGE HEADINGS — shared visual hierarchy across the MPA             */
  /* ------------------------------------------------------------------ */
  pageCopy: {
    home: { kicker: "Home", title: "A builder at the intersection of AI, software, and systems.", description: "Computer Science undergraduate passionate about using intelligent systems to solve practical problems with clean architecture and polished user experiences." },
    about: { kicker: "About", title: "A builder at the intersection of AI, software, and systems.", description: "Computer Science undergraduate focused on practical software engineering, applied AI/ML, and connected systems." },
    skills: { kicker: "Skills", title: "Technical range for intelligent product engineering.", description: "Resume-backed skills across programming, AI engineering, data, tools, and practical software foundations." },
    projects: { kicker: "Projects", title: "Building practical systems from ideas that matter.", description: "A selection of hands-on work across AI/ML, computer vision, IoT, and software engineering." },
    experience: { kicker: "Experience", title: "Professional Experience", description: "Hands-on software development experience in an enterprise environment." },
    education: { kicker: "Education", title: "Academic Background", description: "Academic progression through Computer Science Engineering and Data Science." },
    achievements: { kicker: "Achievements", title: "Achievements & Recognition", description: "Competition results, distinctions, and academic recognition." },
    certifications: { kicker: "Certifications", title: "Certifications & Credentials", description: "Verified courses and certifications that complement my technical work." },
    research: { kicker: "Research", title: "Research & Publication", description: "Academic work exploring deepfake defense and applied AI." },
    leadership: { kicker: "Leadership", title: "Leadership & Involvement", description: "Student leadership through technical events, workshops, and coding activities." },
    activities: { kicker: "Activities", title: "Beyond the Classroom", description: "Workshops, industrial exposure, community services, strengths, hobbies, and interests." },
    contact: { kicker: "Contact", title: "Let's Connect", description: "Open to internships and entry-level roles in software development, AI/ML, and IoT." }
  },

  /* ------------------------------------------------------------------ */
  /* ABOUT                                                               */
  /* ------------------------------------------------------------------ */
  about: {
    intro:
      "I'm a final-year Computer Science Engineering student at Dadi Institute of Engineering and Technology (Autonomous), Anakapalli, affiliated with JNTUGV, and pursuing an honours track in Data Science alongside my core degree. My work sits at the intersection of practical software development and applied AI/ML/IoT — building systems that take in real-world signals (road images, sensor readings) and turn them into something actionable.",
    points: [
      "Hands-on enterprise development experience from a software internship at BHEL, working with JSP and MySQL",
      "Four independent projects spanning deep learning, computer vision, IoT hardware, and systems programming in C",
      "Elected Secretary of the DIET ACM Student Chapter, organizing technical events and coding activities",
      "Published research abstract on deepfake defense, and consistent placings in competitive coding events"
    ]
  },

  /* ------------------------------------------------------------------ */
  /* SKILLS — organized by category. No proficiency percentages, since  */
  /* the resume doesn't provide verified ratings.                       */
  /* ------------------------------------------------------------------ */
  skills: {
    categories: [
      {
        name: "Programming Languages",
        items: ["C", "C++", "Java", "Python"]
      },
      {
        name: "Web Technologies",
        items: ["HTML", "CSS", "JavaScript", "JSP"]
      },
      {
        name: "AI / Machine Learning",
        items: ["YOLO", "OpenCV", "NumPy"]
      },
      {
        name: "Databases",
        items: ["MySQL"]
      },
      {
        name: "CS Fundamentals",
        items: ["Data Structures & Algorithms", "Object-Oriented Programming", "DBMS", "Computer Networks", "Operating Systems"]
      },
      {
        name: "Development Tools",
        items: ["VS Code", "NetBeans", "Git", "GitHub", "HeidiSQL"]
      }
    ],
    // Kept separate from technical skills deliberately — these are assistive
    // tools, not programming competencies.
    aiTools: ["ChatGPT", "Claude", "Grok", "NotebookLM"]
  },

  /* ------------------------------------------------------------------ */
  /* EXPERIENCE                                                          */
  /* ------------------------------------------------------------------ */
  experience: [
    {
      role: "Industrial Software Developer Intern",
      company: "Bharat Heavy Electricals Limited (BHEL)",
      location: "Visakhapatnam, Andhra Pradesh",
      duration: "May 2025 – June 2025",
      points: [
        "Developed a Training Management System and Vehicle Requisition Module to automate manual workflows and reduce processing time",
        "Gained hands-on experience building enterprise web applications using JSP and MySQL"
      ],
      // Path to your internship completion letter / certificate (PDF or image).
      proofUrl: "assets/Internship.pdf"
    }
  ],

  /* ------------------------------------------------------------------ */
  /* PROJECTS                                                            */
  /* category: one of "AI/ML", "IoT", "Software" — used for filtering    */
  /* ------------------------------------------------------------------ */
  projects: [
    {
      name: "Pothole Detection Assistant",
      duration: "May 2026 – June 2026",
      category: "AI/ML",
      description:
        "A deep learning-based system that analyzes road images and video to flag pothole damage, built to support real-time road maintenance prioritization.",
      technologies: ["Python", "YOLO", "OpenCV", "NumPy"],
      github: "https://github.com/koushik-kudirilla/Pothole-Detection-System"
    },
    {
      name: "Smart Crowd Monitoring System Using IoT",
      duration: "February 2026 – March 2026",
      category: "IoT",
      description:
        "An IoT-based system that monitors crowd density and environmental conditions in real time to support public safety decisions.",
      technologies: ["Arduino Uno R4 Wi-Fi", "IR Sensors", "DHT11", "MQTT"],
      github: "https://github.com/koushik-kudirilla/Smart-Crowd-Monitor"
    },
    {
      name: "Smart Weather Monitoring System",
      duration: "October 2025 – November 2025",
      category: "IoT",
      description:
        "An offline weather monitoring system delivering real-time temperature, humidity, and rainfall data, built for rural farmers.",
      technologies: ["Arduino ESP8266", "Embedded C", "DHT11", "Rain Sensor", "LDR Sensor"],
      github: "https://github.com/koushik-kudirilla/Smart-Weather-Monitoring-System"
    },
    {
      name: "Supermarket Management System",
      duration: "January 2024 – March 2024",
      category: "Software",
      description:
        "A C-based supermarket management system with a user-friendly GUI, handling inventory, billing, and customer transactions.",
      technologies: ["C"],
      github: "https://github.com/koushik-kudirilla/SuperExpressMart"
    }
  ],

  /* ------------------------------------------------------------------ */
  /* EDUCATION                                                           */
  /* ------------------------------------------------------------------ */
  education: [
    {
      degree: "B.Tech, Computer Science Engineering",
      institution: "Dadi Institute of Engineering and Technology (Autonomous), Anakapalli",
      board: "JNTUGV",
      duration: "2023 – 2027",
      status: "Pursuing",
      score: "73.84%"
    },
    {
      degree: "B.Tech Honours, Data Science",
      institution: "Dadi Institute of Engineering and Technology (Autonomous), Anakapalli",
      board: "JNTUGV",
      duration: "2025 – 2027",
      status: "Pursuing",
      score: "CGPA 7.67"
    },
    {
      degree: "Intermediate (MPC)",
      institution: "Narayana Junior College, Visakhapatnam",
      board: "BIEAP",
      duration: "2022",
      status: "Completed",
      score: "59.1%"
    },
    {
      degree: "SSC",
      institution: "Ravindra Bharathi School, Visakhapatnam",
      board: "AP Board",
      duration: "2020",
      status: "Completed",
      score: "100%"
    }
  ],

  /* ------------------------------------------------------------------ */
  /* ACHIEVEMENTS                                                        */
  /* ------------------------------------------------------------------ */
  achievements: [
    {
      title: "1st Prize",
      context: "DIET ACM Coding Competition",
      detail: "Among 120 participants",
      date: "December 2023"
    },
    {
      title: "Certificate of Merit",
      context: "JNTUGV Coding Competition",
      detail: "Among 430 participants",
      date: "January 2025"
    },
    {
      title: "2nd Prize",
      context: "DIET CSI Coding Competition",
      detail: "Among 150 participants",
      date: "December 2023"
    },
    {
      title: "2nd Prize",
      context: "Vibrant DIET Coding Competition",
      detail: "Among 300 participants",
      date: "January 2024"
    },
    {
      title: "NPTEL Elite + Gold",
      context: "The Joy of Computing Using Python",
      detail: "Scored 92%",
      date: "Jan – Apr 2025"
    },
    {
      title: "NPTEL Elite + Silver",
      context: "Exploratory Data Analysis for Data Science with R",
      detail: "Scored 75%",
      date: "Jul – Oct 2025"
    }
  ],

  /* ------------------------------------------------------------------ */
  /* CERTIFICATIONS                                                      */
  /* Add `proofUrl: "assets/your-file.pdf"` to any entry once you've     */
  /* dropped the soft copy into assets/ — a "View Certificate" link      */
  /* will appear on that card automatically.                             */
  /* ------------------------------------------------------------------ */
  certifications: [
    {
      name: "NPTEL Elite + Gold",
      course: "The Joy of Computing Using Python",
      organization: "NPTEL",
      score: "92%",
      date: "January – April 2025",
      proofUrl: "assets/eliteGold.pdf"
    },
    {
      name: "NPTEL Elite + Silver",
      course: "Exploratory Data Analysis for Data Science with R",
      organization: "NPTEL",
      score: "75%",
      date: "July – October 2025",
      proofUrl: "assets/eliteSilver.pdf"
    },
    {
      name: "B1 Level English Certification",
      course: null,
      organization: "Cambridge",
      score: null,
      date: "July 2025",
      proofUrl: "assets/cambridge.pdf"
    },
    {
      name: "Quantum Fundamentals",
      course: null,
      organization: "Qubi Tech",
      score: null,
      date: "April 2026",
      proofUrl: "assets/fundamental.pdf"
    },
    {
      name: "Java (Basic)",
      course: null,
      organization: "HackerRank",
      score: null,
      date: "January 2025",
      proofUrl: "assets/java.pdf"
    }
  ],

  /* ------------------------------------------------------------------ */
  /* RESEARCH                                                            */
  /* ------------------------------------------------------------------ */
  research: {
    title: "Deepfake Defense Agent",
    type: "Abstract published in an NCTC book chapter publication",
    paperId: "NCTCT2K251041"
  },

  /* ------------------------------------------------------------------ */
  /* LEADERSHIP                                                          */
  /* ------------------------------------------------------------------ */
  leadership: {
    role: "Secretary, DIET ACM Student Chapter",
    duration: "2025 – Present",
    points: [
      "Organized technical events",
      "Coordinated workshops",
      "Coordinated coding activities"
    ]
  },

  /* ------------------------------------------------------------------ */
  /* WORKSHOPS & INDUSTRIAL EXPOSURE                                     */
  /* Same proofUrl pattern as certifications.                            */
  /* ------------------------------------------------------------------ */
  workshops: [
    {
      title: "Industrial Visit — MongoDB",
      location: "Bengaluru",
      date: "August 29, 2026",
      detail: "Industrial exposure through a visit to MongoDB in Bengaluru.",
      gallery: [
        "assets/galleries/MongoDB_Vist/2%20(1).jpeg",
        "assets/galleries/MongoDB_Vist/2%20(2).jpeg",
        "assets/galleries/MongoDB_Vist/2%20(3).jpeg",
        "assets/galleries/MongoDB_Vist/2%20(4).jpeg",
        "assets/galleries/MongoDB_Vist/2%20(5).jpeg",
        "assets/galleries/MongoDB_Vist/2%20(6).jpeg",
        "assets/galleries/MongoDB_Vist/2%20(7).jpeg",
        "assets/galleries/MongoDB_Vist/2%20(8).jpeg",
        "assets/galleries/MongoDB_Vist/2%20(9).jpeg",
        "assets/galleries/MongoDB_Vist/2%20(10).jpeg",
        "assets/galleries/MongoDB_Vist/2%20(11).jpeg"
      ],
      proofUrl: null
    },
    {
      title: "Quantum Computing Workshop",
      organizer: "APSSDC",
      date: "February 9 – 13, 2026",
      detail: "Participated in a five-day Quantum Computing Workshop conducted by APSSDC.",
      gallery: [],
      proofUrl: "assets/quantum.pdf"
    },
    {
      title: "Workshop — TRAI",
      organizer: "TRAI",
      date: "February 28, 2025",
      detail: "Participated in a workshop conducted by TRAI.",
      gallery: [],
      proofUrl: "assets/trai.pdf"
    }
  ],

  /* ------------------------------------------------------------------ */
  /* COMMUNITY / VOLUNTEER                                               */
  /* ------------------------------------------------------------------ */
  community: [
    {
      title: "Blood Donation",
      organization: "NTR Trust",
      detail: "Participated in a blood donation initiative with NTR Trust.",
      gallery: [],
      date: "October 1, 2024"
    },
    {
      title: "Organic Farming Awareness",
      detail: "Conducted awareness campaigns on organic farming",
      gallery: [
        "assets/galleries/organic_farming/1%20(1).jpeg",
        "assets/galleries/organic_farming/1%20(2).jpeg",
        "assets/galleries/organic_farming/1%20(3).jpeg",
        "assets/galleries/organic_farming/1%20(4).jpeg",
        "assets/galleries/organic_farming/1%20(5).jpeg",
        "assets/galleries/organic_farming/1%20(6).jpeg",
        "assets/galleries/organic_farming/1%20(7).jpeg",
        "assets/galleries/organic_farming/1%20(8).jpeg"
      ],
      date: "May – June 2024"
    }
  ],

  /* ------------------------------------------------------------------ */
  /* GALLERIES — add image paths when photos are available.             */
  /* The gallery UI is already wired; empty galleries show a clean      */
  /* upload-ready state instead of broken image icons.                  */
  /* ------------------------------------------------------------------ */
  galleries: {
    industrialVisit: [],
    communityServices: []
  },

  /* ------------------------------------------------------------------ */
  /* STRENGTHS & HOBBIES                                                 */
  /* ------------------------------------------------------------------ */
  strengths: ["Video Editing", "Quick Learning", "Patience", "Leadership Quality"],
  hobbies: ["Playing Guitar", "Cooking", "Listening to Music"],

  /* ------------------------------------------------------------------ */
  /* CONTACT                                                             */
  /* ------------------------------------------------------------------ */
  contact: {
    heading: "Let's build something meaningful.",
    subtext: "Open to internships and entry-level roles in software development, AI/ML, and IoT. Reach out by email or connect on LinkedIn."
  }
};
