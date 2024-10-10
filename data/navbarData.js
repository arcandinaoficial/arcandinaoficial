const navbarData = [
    {
      name: 'Home',
      actionType: 'navigate',
      action: '/',
    },
    {
      name: 'About Us',
      actionType: 'scroll',
      action: 'about-section',
    },
    {
      name: 'Services',
      actionType: 'navigate',
      action: '/services',
    },
    {
      name: 'Contact',
      actionType: 'function',
      action: () => alert('Contact us at info@example.com'),
    },
  ];
  
export default navbarData;
  