document.addEventListener("DOMContentLoaded", function() {

// Light / Dark
function applyDarkMode(isDarkMode) {
  document.body.classList.toggle("dark-mode", isDarkMode);
  document.querySelectorAll('a').forEach((link) => {
      link.classList.toggle('dark-mode', isDarkMode);
  });
}
function toggleDarkMode() {
  darkMode = !darkMode;
  applyDarkMode(darkMode);
  localStorage.setItem('darkMode', darkMode);
}
let darkMode;
const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
const savedMode = localStorage.getItem('darkMode');
if (savedMode !== null) {
  darkMode = savedMode === 'true';
} else if (userPrefersDark) {
  darkMode = true;
} else if (userPrefersLight) {
  darkMode = false;
} else {
  darkMode = false;
}
applyDarkMode(darkMode);
const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('click', toggleDarkMode);

// Zoom In / Out
function adjustZoom(isZoomIn) {
  const zoomFactor = isZoomIn ? 1.05 : 0.95;
  const elements = document.querySelectorAll("html, button, td, .img-container");
  elements.forEach(function(element) {
    let currentFontSize = parseFloat(window.getComputedStyle(element).fontSize);
    currentFontSize = currentFontSize * zoomFactor;
    element.style.fontSize = currentFontSize + "px";
  });
  const baseFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
  localStorage.setItem('baseFontSize', baseFontSize);
}
  const savedFontSize = localStorage.getItem('baseFontSize');
  if (savedFontSize) {
    document.documentElement.style.fontSize = savedFontSize + 'px';
  }
document.getElementById("zoom-in").addEventListener("click", function() {
  adjustZoom(true);
});
document.getElementById("zoom-out").addEventListener("click", function() {
  adjustZoom(false);
});

// Single Page Application
  const welcomeNav = document.getElementById('welcome-nav');
  const postContainers = document.querySelectorAll('.post-container');
  const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.querySelector('.post-content').style.display = 'block';
        observer.unobserve(entry.target);
      }
    });
  });
  postContainers.forEach(function(container) {
    observer.observe(container);
    container.querySelector('.post-content').style.display = 'none';
  });
  function showPostContainer(postId) {
    let targetContainer = null;
    postContainers.forEach(function(container) {
      if (container.id === postId) {
        container.style.display = 'block';
        targetContainer = container;
        const postNav = container.querySelector('.post-nav');
        if (postNav) {
          let postNavBottom = container.querySelector('.post-nav-bottom');
          if (!postNavBottom) {
            postNavBottom = postNav.cloneNode(true);
            postNavBottom.classList.add('post-nav-bottom');
            container.appendChild(postNavBottom);
          }
        }
        welcomeNav.style.display = 'none';
      } else {
        container.style.display = 'none';
      }
    });
    if (targetContainer) {
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          setTimeout(function() {
            const offsetTop = targetContainer.getBoundingClientRect().top + window.pageYOffset - 20;
            window.scrollTo({
              top: offsetTop,
              behavior: 'instant'
            });
          }, 1); 
        });
      });
    }
  }
  function displayAllPosts() {
    postContainers.forEach(function(container, index) {
      container.style.display = 'block';
      if (index !== 0) {
        container.querySelector('.post-content').style.display = 'none';
      }
      observer.observe(container);
      const postNavBottom = container.querySelector('.post-nav-bottom');
      if (postNavBottom) {
        postNavBottom.remove();
      }
    });
    welcomeNav.style.display = 'block';
  }
  function handleNavigation(postId) {
    if (postId) {
      showPostContainer(postId);
      history.pushState({ postId: postId }, '', '/' + postId);
    } else {
      displayAllPosts();
      history.pushState({}, '', window.location.origin);
      window.scrollTo(0, 0);
    }
  }
  window.onpopstate = function(event) {
    if (event.state && event.state.postId) {
      showPostContainer(event.state.postId);
    } else {
      displayAllPosts();
    }
  };
  document.addEventListener('click', function(event) {
    const anchor = event.target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noreferrer');
        return;
    }
      event.preventDefault();
      if (href === '/') {
        handleNavigation('');
      } else {
        const postId = href.startsWith('/') ? href.substring(1) : href;
        handleNavigation(postId);
      }
    }
  });  
  const path = window.location.pathname.substring(1);
  if (path) {
    showPostContainer(path);
  } else {
    displayAllPosts();
  }

// Sticky Header
function debounce(func, wait) {
  let timeout;
  return function() {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
  };
}
const scrollTransition = 50;
const header = document.getElementById('siteHeader');
const toTop = document.getElementById("toTop");
const handleScroll = debounce(function() {
if (window.scrollY > scrollTransition) {
    header.classList.add('scrolled-down');
} else {
    header.classList.remove('scrolled-down');
}

// Go To Top
if (document.body.scrollTop > scrollTransition * 7 || document.documentElement.scrollTop > scrollTransition * 7) {
    toTop.style.display = "block";
} else {
    toTop.style.display = "none";
}
}, 20);
window.addEventListener('scroll', handleScroll);
});
function topFunction() {
  window.scrollTo(0, 0);
}
