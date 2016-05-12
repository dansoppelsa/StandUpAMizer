Vue.transition('getit', {
    enterClass: 'fadeInUpBig',
    leaveClass: 'hide'
});

new Vue({
    el: '#standup',
    data: {
        projects: [
            {
                name: 'Five Four Club',
                url: 'https://c676132.ssl.cf0.rackcdn.com/fivefoursq-54e7d376db141.png'
            },
            {
                name: 'Juvo',
                url: 'http://www.morrell-middleton.co.uk/wp-content/uploads/logo-placeholder.jpg'
            },
            {
                name: 'Igloo',
                url: 'http://www.ocgc.gov.on.ca/images/content/userfiles/Igloo-Logo-620x143.jpg'
            },
            {
                name: 'GB Metrics',
                url: 'http://www.morrell-middleton.co.uk/wp-content/uploads/logo-placeholder.jpg'
            },
            {
                name: 'Clearitie',
                url: 'https://clearitie.com/wp-content/uploads/2016/03/clearitie-200x200.png'
            },
            {
                name: 'Fongo Works',
                url: 'https://www.fongoworks.com/assets/images/fongo-shadow.png'
            },
            {
                name: 'Home.ca',
                url: 'https://06b9ff6032ffbd1e7065-e6e732c31d0330a645ee5ace11ddb9de.ssl.cf5.rackcdn.com/img/logo.png'
            },
            {
                name: 'IAS (Polehunter 3000)',
                url: 'http://www.morrell-middleton.co.uk/wp-content/uploads/logo-placeholder.jpg'
            },
            {
                name: 'Pairing App',
                url: 'https://boldanddetermined.com/wp-content/uploads/2012/03/Good-Handshake.jpg'
            }
        ],
        currentProject: null,
        currentIndex: -1,
        last: {
            name: 'Vehikl',
            url: 'http://vehikl.com/assets/style-guide/vehikl_avatar.jpg'
        },
        loading: false,
        goodday: false
    },
    methods: {
        nextProject: function() {
            if (this.allDone) {
                this.goodday = true;
                return;
            }

            this.currentIndex++;

            var that = this;
            this._showLoader(1000, function() {
                that.currentProject = that.projects[that.currentIndex];
                console.log(that.incomplete, that.complete);
            })
        },
        lastProject: function() {
            if (this.currentIndex <= 0) {
                return;
            }
            this.currentProject = this.projects[--this.currentIndex];
        },
        _showLoader: function (duration, complete) {
            this.loading = true;
            var that = this;
            window.setTimeout(function() {
                that.loading = false;
                complete();
            }, duration);
        }
    },
    computed: {
        incomplete: function() {
            return this.currentIndex >= 0 ?
                this.projects.slice(this.currentIndex + 1) :
                this.projects;
        },
        complete: function() {
            return this.currentIndex >= 0 ?
                this.projects.slice(0, this.currentIndex).reverse() :
                [];
        },
        allDone: function() {
            return this.incomplete.length === 0;
        }
    },
    ready: function() {
        this.projects = _.shuffle(this.projects);
        this.projects.push(this.last);
    }
});