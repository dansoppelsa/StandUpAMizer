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
                url: 'https://clearitie.com/wp-content/uploads/2016/03/clearitie-200x200.png',
                phonetic: 'clarity'
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
                name: 'Co Pilot',
                url: 'http://copilotmobileapp.com/images/logo_black.png'
            },
            {
                name: 'We Work',
                url: 'http://berkeleystartupcluster.com/wp-content/uploads/2014/11/wework-logo-1.png'
            }
        ],
        currentProject: null,
        currentIndex: -1,
        last: {
            name: 'Vehikl',
            url: 'http://vehikl.com/assets/style-guide/vehikl_avatar.jpg',
            phonetic: 'Vehicle'
        },
        loading: false,
        goodday: false,
        timer: 0,
        playa: null,
        timeLimit: 60,
        initialVolume: 0.2,
        voices: null
    },
    methods: {
        nextProject: function() {
            if (this.allDone) {
                this.goodday = true;
                this._say('Do what you gotta do today, Fuck wit it.');
                return;
            }

            this._stopMusic();

            this.currentIndex++;
            if (this.currentIndex == 0) {
                this._startTimer();
            }

            var that = this;
            this._showLoader(2300, function() {
                that.currentProject = that.projects[that.currentIndex];
                var say = that.currentProject.phonetic != undefined ?
                    that.currentProject.phonetic :
                    that.currentProject.name;
                that._say(say);
                that._restartTimer();
            })
        },
        lastProject: function() {
            if (this.currentIndex <= 0) {
                return;
            }
            this._stopMusic();
            this.currentProject = this.projects[--this.currentIndex];
            this._restartTimer();
        },
        _showLoader: function (duration, complete) {
            this._drumroll();
            this.loading = true;
            var that = this;
            window.setTimeout(function() {
                that.loading = false;
                complete();
            }, duration);
        },
        _restartTimer: function () {
            this.timer = 0;
        },
        _startTimer: function() {
            var that = this;
            window.setInterval(function() {
                that.timer++;

                if (that.timer === that.timeLimit) {
                    that._startMusic();
                }

                if (that.timer >= that.timeLimit && that.playa.volume < 1) {
                    var newVolume = that.playa.volume + 0.05;
                    newVolume = newVolume > 1 ? 1 : newVolume;
                    that.playa.volume = newVolume;
                }
            }, 1000);
        },
        _startMusic: function () {
            this.playa.play();
        },
        _stopMusic: function () {
            this.playa.pause();
            this.playa.currentTime = 0;
            this.playa.volume = this.initialVolume;
        },
        _resetVolume: function() {
            this.playa.volume = this.initialVolume;
        },
        _say: function(string) {
            var utterance = new SpeechSynthesisUtterance();
            utterance.text = string;
            utterance.lang = "en-GB";
            utterance.rate = 0.8;
            utterance.volume = 1.0;
            utterance.voice = this.voices[0];
            speechSynthesis.speak(utterance);
        },
        _getVoices: function() {
            var that = this;
            speechSynthesis.onvoiceschanged = function () {
                that.voices = _.filter(speechSynthesis.getVoices(), function(voice) {
                    return voice.name == 'Google US English';
                });
            };
        },
        _drumroll: function () {
            var drumroll = document.getElementById('drumroll');
            drumroll.play();
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
        },
        timerDisplay: function() {
            return (new Date).clearTime()
                .addSeconds(this.timer)
                .toString('mm:ss');
        }
    },
    ready: function() {
        this.projects = _.shuffle(this.projects);
        this.projects.push(this.last);
        this.playa = document.getElementById('playa');
        this._resetVolume();
        this._getVoices();
    }
});
