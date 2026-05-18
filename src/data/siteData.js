export const navItems = [
  { label: 'Me', to: '/' },
  { label: 'Labs', to: '/labs' },
]

export const heroMediaConfig = {
  // Use a file name from public/media/bg-videos/me-hero, or null for fully random order.
  // Example: 'gif-cutlas.mp4'
  firstMedia: null,
}

export const heroSlides = [
  {
    title: 'Mini FRC 2021: Manticore',
    summary: 'Fully custom 1/3 scale FRC robot with modular holonomic drive. 3D printed.',
    image: '/media/img/works/ManticoreSummary.gif',
    link: '/manticore.pdf',
  },
  {
    title: 'Armadillo: Jenga Stacking Robot',
    summary:
      'Fully custom carbon fiber and 3D printed palletizing arm with suction system for stacking Jenga.',
    image: '/media/img/works/armadillo.gif',
    link: 'https://olincollege.github.io/pie-2021-03/Armadillo/',
  },
  {
    title: 'Robotics: 3D Scanner',
    summary: 'Custom-designed and coded 3D scanner with swerve drive pan tilt.',
    image: '/media/img/works/3dscanner.gif',
    link: '/manticore.pdf',
  },
]

export const experiences = [
  {
    title: 'MORSE Corp',
    period: 'Current',
    image: '/media/img/morse/logo.jpg',
    summary: 'I work at MORSE Corp as an Electromechanical Systems Engineer.',
    links: [
      { label: 'Learn More', href: 'https://www.morsecorp.com/' },
      { label: 'Company Website', href: 'https://www.morsecorp.com/' },
    ],
  },
  {
    title: 'Autonodyne',
    period: '2023-2026',
    image: '/media/img/autonodyne/logo.png',
    summary: 'I worked at Autonodyne for 2 years as a Systems and Flight Test engineer.',
    links: [
      { label: 'Learn More', href: 'https://autonodyne.com/' },
      { label: 'Company Website', href: 'https://autonodyne.com/' },
    ],
  },
  {
    title: 'Ascent Aerosystems',
    period: 'Summer 2022',
    popupProjectSlug: 'ascent-aerosystems',
    image: '/media/img/ascent/spirit_3.jpg',
    summary:
      'Over Summer 2022, I was an engneering intern designing and testing coaxial UAVs. This involved mechanical design, electrical integration, and flight testing.',
    links: [
      { label: 'Learn More', href: '/projects/ascent-aerosystems' },
      { label: 'Company Website', href: 'https://ascentaerosystems.com/' },
    ],
  },
  {
    title: 'Olin College Design Build Fly',
    period: '2019-2023',
    image: '/media/img/works/dbf1.png',
    summary:
      "I was Project Manager for Olin College's entry in the 2022 AIAA DBF competition. We placed 15th of over 100 teams with a 7ft wingspan composite wing RC aircraft.",
    links: [
      { label: 'Team Website', href: 'https://www.olindbf.com/' },
      { label: '2023 Video', href: 'https://www.youtube.com/watch?v=3GahRhWaBnU' },
    ],
  },
  {
    title: 'OSSTP SWARM-Ex Cubesat',
    period: 'Summer 2021',
    popupProjectSlug: 'swarm-ex',
    image: '/media/img/swarm-ex/logo.png',
    summary:
      'I was a mechanical engineer on the SWARM-Ex Cubesat project. This involved collaboration to create a cubesat frame capable of housing and interfacing equipment being designed by many different universities.',
    links: [
      { label: 'Project Website', href: 'https://www.osstp.org/swarm-ex' },
      { label: 'Learn More', href: '/projects/swarm-ex' },
    ],
  },
]

export const about = {
  image: '/media/img/about2.jpg',
  paragraphs: [
    "Hi! I'm Tiger Sky Jewell-Alibhai, but everyone calls me Tigey. I am 25 years old and love anything to do with Engineering and Design. I am pursuing a career in Hardware Engineering as a electromechanical engineer at MORSE Corp.",
    'In my free time, I enjoy making projects that involve any and all engineering disciplines. From electronic tabletop games to astrophotography, and custom wire EDM gantries to carbon fiber winding machines, I love the process of making from concept to final (hopefully working) product.',
    'I am also an avid drone & FPV enthusiast, and enjoy making anything that flies. My long term sub-250g tube launch plane project returns to development whenever the weather is nice, and has been through many iterations already.',
    "At Olin College, I had the opportunity to turn my ideas into meaningful projects and collaborated with amazing people on a daily basis. I was the Project Manager of Olin's Design Build Fly aircraft team and I was involved in other projects such as designing and building a 3D scanner, creating a frisbee tracking system, developing a modular videogame, and using PCA and eigenfaces to identify endangered species of animals by their footprints.",
    'I am now working at MORSE Corp in Boston, as an electromechanical engineer. I love the work variety of rapid prototyping of mechanical, electrical, and software integrated systems, as well as frequent unmanned vehicle testing. Whether it is a plane, a multirotor, a rover, or even a boat, I love the process of quickly making or adapting a system to meet needs as they arise.',
  ],
}

export const labsIntro = {
  image: '/media/img/banner/labs2.png',
  description:
    'TigrisLabs is my portfolio of personal projects focused on practical engineering, clean documentation, and open sharing.',
}

export const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/tiger-jewell-alibhai-aa22a316a/',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/TigeyJewellAlibhai',
  },
]
