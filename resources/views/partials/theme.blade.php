<script>
    /* Aplica o tema antes da renderização para evitar mudança visível de cores. */
    (function () {
        const storageKey = 'wc-theme';

        window.wcApplyTheme = function (theme) {
            const selectedTheme = theme === 'dark' ? 'dark' : 'light';
            document.documentElement.dataset.theme = selectedTheme;
            document.body?.classList.toggle('theme-dark', selectedTheme === 'dark');

            try {
                localStorage.setItem(storageKey, selectedTheme);
            } catch (error) {
                console.warn('Não foi possível salvar a preferência de tema.', error);
            }

            window.dispatchEvent(new CustomEvent('wc-theme-change', {
                detail: { theme: selectedTheme },
            }));

            return selectedTheme;
        };

        let savedTheme = 'light';
        try {
            savedTheme = localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light';
        } catch (error) {
            console.warn('Não foi possível carregar a preferência de tema.', error);
        }

        document.documentElement.dataset.theme = savedTheme;
    })();
</script>
