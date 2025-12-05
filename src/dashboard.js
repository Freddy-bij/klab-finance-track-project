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
    if (hash && ['dashboard', 'transaction', 'categories', 'analystics', 'settings'].includes(hash)) {
        switchTab(hash);
    }
});

// Balance Trend Chart (Dashboard)
const ctx = document.getElementById('trendChart').getContext('2d');
const trendChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Nov 1', 'Nov 5', 'Nov 10', 'Nov 15', 'Nov 20', 'Nov 25', 'Today'],
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
        maintainAspectRatio: false,
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

// Income vs Expense Chart (Analytics)
const incomeExpenseCtx = document.getElementById('incomeExpenseChart');
if (incomeExpenseCtx) {
    const incomeExpenseChart = new Chart(incomeExpenseCtx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Income',
                    data: [4000, 2800, 1800, 2500, 1500, 2300],
                    backgroundColor: '#10b981',
                    borderRadius: 6,
                },
                {
                    label: 'Expense',
                    data: [2000, 1200, 9500, 3800, 4700, 3500],
                    backgroundColor: '#ef4444',
                    borderRadius: 6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10000,
                    ticks: {
                        stepSize: 2500,
                        color: '#9ca3af',
                        font: {
                            size: 11
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
                            size: 11
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Category Pie Chart (Analytics)
const categoryCtx = document.getElementById('categoryChart');
if (categoryCtx) {
    const categoryChart = new Chart(categoryCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Other'],
            datasets: [{
                data: [450, 320, 280, 200, 150],
                backgroundColor: [
                    '#10b981',
                    '#06b6d4',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 11
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    return {
                                        text: `${label}: ${value}.00`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value}.00`;
                        }
                    }
                }
            }
        }
    });
}


// SETTINGS INNER TAB SWITCH SYSTEM



const settingTabs = document.querySelectorAll('.setting-tab');
const settingContents = document.querySelectorAll('.setting-content');

function switchSettingTab(tab) {

    settingContents.forEach(section => section.classList.add('hidden'));

  
    settingTabs.forEach(btn => {
        btn.classList.remove('bg-white', 'shadow');
        btn.classList.add('bg-transparent');

        const icon = btn.querySelector('i');
        const text = btn.querySelector('h1');

        icon.classList.remove('text-gray-900');
        icon.classList.add('text-gray-600');

        text.classList.remove('text-gray-900');
        text.classList.add('text-gray-600');
    });


    document.getElementById(tab).classList.remove('hidden');


    const active = document.querySelector(`[data-setting="${tab}"]`);
    active.classList.add('bg-white', 'shadow');

    const icon = active.querySelector('i');
    const text = active.querySelector('h1');

    icon.classList.add('text-gray-900');
    text.classList.add('text-gray-900');

  
    localStorage.setItem("activeSettingTab", tab);
}


settingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-setting');
        switchSettingTab(target);
    });
});


const savedTab = localStorage.getItem("activeSettingTab");

if (savedTab) {
    switchSettingTab(savedTab);
} else {
    switchSettingTab("profile"); 
}

//   BTN toggle

const toggleBtn = document.getElementById("toggleBtn");
const toggleCircle = document.getElementById("toggleCircle");

let isOn = false; 

toggleBtn.addEventListener("click", () => {
    isOn = !isOn;

    if (isOn) {
        toggleBtn.classList.remove("bg-gray-300");
        toggleBtn.classList.add("bg-green-500");
        toggleCircle.classList.add("translate-x-6"); 
    } else {
        toggleBtn.classList.add("bg-gray-300");
        toggleBtn.classList.remove("bg-green-500");
        toggleCircle.classList.remove("translate-x-6"); 
    }
});

