import confetti from 'canvas-confetti';

export function getTodayDateString(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function isTodayBirthday(birthDate?: string): boolean {
  if (!birthDate) return false;
  
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-12
  const currentDate = today.getDate(); // 1-31

  const parts = birthDate.split('-');
  if (parts.length === 3) {
    // YYYY-MM-DD
    const bMonth = parseInt(parts[1], 10);
    const bDate = parseInt(parts[2], 10);
    return bMonth === currentMonth && bDate === currentDate;
  } else if (parts.length === 2) {
    // MM-DD
    const bMonth = parseInt(parts[0], 10);
    const bDate = parseInt(parts[1], 10);
    return bMonth === currentMonth && bDate === currentDate;
  }

  return false;
}

export function formatBirthdayDisplay(birthDate?: string): string {
  if (!birthDate) return 'Not specified';
  const parts = birthDate.split('-');
  if (parts.length >= 2) {
    const monthIdx = parseInt(parts[parts.length - 2], 10) - 1;
    const day = parseInt(parts[parts.length - 1], 10);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${months[monthIdx]} ${day}`;
    }
  }
  return birthDate;
}

export function triggerBirthdayConfetti(): void {
  try {
    const count = 200;
    const defaults = {
      origin: { y: 0.6 },
      zIndex: 99999
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#f472b6', '#ec4899', '#fb7185']
    });
    fire(0.2, {
      spread: 60,
      colors: ['#38bdf8', '#0284c7', '#bae6fd']
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#fde047', '#f59e0b', '#fbbf24']
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: ['#c084fc', '#a855f7', '#e879f9'],
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#ffffff', '#fdf2f8', '#f0f9ff']
    });
  } catch (err) {
    console.error('Confetti error:', err);
  }
}
