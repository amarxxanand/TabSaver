document.addEventListener('DOMContentLoaded', () => {
    const saveTabsBtn = document.getElementById('save-tabs-btn');
    const clearTabsBtn = document.getElementById('clear-tabs-btn');
    const tabsListContainer = document.getElementById('tabs-list-container');
    const emptyMessage = document.getElementById('empty-message');
    const searchBox = document.getElementById('search-box');

    let allSavedTabs = [];

    const renderTabs = (tabs = []) => {
        tabsListContainer.innerHTML = '';

        if (tabs.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.id = 'empty-message';
            emptyMsg.textContent = allSavedTabs.length === 0 ? 'No tabs saved yet. Click "Save All Tabs" to begin.' : 'No tabs match your search.';
            tabsListContainer.appendChild(emptyMsg);
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'tabs-list';

        tabs.forEach((tab, index) => {
            const li = document.createElement('li');
            li.className = 'tab-item';

            const tabNumber = document.createElement('span');
            tabNumber.className = 'tab-number';
            tabNumber.textContent = `${index + 1}.`;

            const tabLink = document.createElement('a');
            tabLink.href = tab.url;
            tabLink.textContent = tab.title || tab.url;
            tabLink.title = tab.url;
            tabLink.target = '_blank';

            const favicon = document.createElement('img');
            favicon.src = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(tab.url)}&size=16`;

            favicon.onerror = function () {
                const domain = new URL(tab.url).hostname;
                this.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;

                this.onerror = function () {
                    this.src = 'images/tabsaver.png';
                };
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.title = 'Delete this tab';
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteTab(tab.url);
            });

            li.appendChild(tabNumber);
            li.appendChild(favicon);
            li.appendChild(tabLink);
            li.appendChild(deleteBtn);
            ul.appendChild(li);
        }); tabsListContainer.appendChild(ul);
    };

    const filterTabs = (query) => {
        if (!query.trim()) {
            renderTabs(allSavedTabs);
            return;
        }

        const filtered = allSavedTabs.filter(tab =>
            (tab.title && tab.title.toLowerCase().includes(query.toLowerCase())) ||
            (tab.url && tab.url.toLowerCase().includes(query.toLowerCase()))
        );

        renderTabs(filtered);
    };

    const deleteTab = (urlToDelete) => {
        allSavedTabs = allSavedTabs.filter(tab => tab.url !== urlToDelete);
        chrome.storage.local.set({ savedTabs: allSavedTabs }, () => {
            const currentQuery = searchBox.value;
            if (currentQuery.trim()) {
                filterTabs(currentQuery);
            } else {
                renderTabs(allSavedTabs);
            }
        });
    }; const loadSavedTabs = () => {
        chrome.storage.local.get(['savedTabs'], (result) => {
            allSavedTabs = result.savedTabs || [];
            renderTabs(allSavedTabs);
        });
    };

    saveTabsBtn.addEventListener('click', () => {
        chrome.tabs.query({}, (tabs) => {
            const tabsToSave = tabs.filter(tab => tab.url && !tab.url.startsWith('chrome://'));

            const tabData = tabsToSave.map(tab => ({
                title: tab.title,
                url: tab.url,
            }));

            chrome.storage.local.set({ savedTabs: tabData }, () => {
                allSavedTabs = tabData;
                renderTabs(allSavedTabs);
                searchBox.value = '';
            });
        });
    });

    clearTabsBtn.addEventListener('click', () => {
        chrome.storage.local.remove(['savedTabs'], () => {
            allSavedTabs = [];
            renderTabs([]);
            searchBox.value = '';
        });
    });

    searchBox.addEventListener('input', (e) => {
        filterTabs(e.target.value);
    });

    loadSavedTabs();
});
