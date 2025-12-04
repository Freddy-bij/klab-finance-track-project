   const tabLinks = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');
        const pageTitle = document.getElementById('pageTitle');

        function switchTab(tabName) {
       
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

     
            tabLinks.forEach(link => {
                link.classList.remove('bg-green-500', 'text-white');
                link.classList.add('text-gray-700', 'hover:bg-gray-100');
            });

           
            const selectedContent = document.getElementById(`${tabName}-content`);
            if (selectedContent) {
                selectedContent.classList.remove('hidden');
            }

      
            const activeLink = document.querySelector(`[data-tab="${tabName}"]`);
            if (activeLink) {
                activeLink.classList.add('bg-green-500', 'text-white');
                activeLink.classList.remove('text-gray-700', 'hover:bg-gray-100');
            }

          
            pageTitle.textContent = tabName.charAt(0).toUpperCase() + tabName.slice(1);

            window.location.hash = tabName;
        }

        
        tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = link.getAttribute('data-tab');
                switchTab(tabName);
            });
        });

 
        window.addEventListener('DOMContentLoaded', () => {
            const hash = window.location.hash.slice(1);
            if (hash && ['dashboard', 'transaction', 'categories', 'analytics' , 'settings'].includes(hash)) {
                switchTab(hash);
            }
        });


         // Balance Trend Chart
    const ctx = document.getElementById('trendChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Nov 1', ' Nov 5', 'Nov 10', 'Jan 15', 'Nov 20', 'Nov 25', 'Today'],
        datasets: [{
          label: 'Balance',
          data: [2400, 2300, 2900, 2200, 2500, 2700, 2250],
          borderColor: '#14b8a6',
          backgroundColor: 'white',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#14b8a6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
         
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true
          },
          filler: {
            propagate: true
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 0,
            max: 3000,
            ticks: {
              stepSize: 750,
              color: '#9ca3af',
              font: {
                size: 12
              }
            },
            grid: {
              color: '#e5e7eb',
              drawBorder: false
            }
          },
          x: {
            ticks: {
              color: '#9ca3af',
              font: {
                size: 12
              }
            },
            grid: {
              display: false
            }
          }
        }
      }
    });