Vue.transition('getit', {
    enterClass: 'fadeInUpBig',
    leaveClass: 'hide'
});

Vue.transition('show-card', {
    enterClass: 'flipInX',
    leaveClass: 'flipOutX'
});

new Vue({
    el: '#standup',
    data: {
        projects: null,
        currentProject: null,
        currentIndex: -1,
        last: {
            name: 'Vehikl',
            url: 'http://vehikl.com/assets/style-guide/vehikl_avatar.jpg',
            phonetic: 'Vehicle',
            gtfo_music: false
        },
        loading: false,
        goodday: false,
        time: 0,
        timerId: null,
        playa: null,
        timeLimit: 45,
        initialVolume: 0.0,
        voices: null,
        playing: false,
        drumroll: null
    },
    methods: {
        nextProject: function() {
            if (this.loading) {
                return;
            }

            if (this.allDone) {
                this.goodday = true;
                this._say('Do what you gotta do today, Fuck wit it.');
                return;
            }

            this._stopMusic();
            this._stopTimer();
            this.currentIndex++;

            var that = this;
            this._showLoader(1500, function() {
                that.currentProject = that.projects[that.currentIndex];
                var say = that.currentProject.phonetic != undefined ?
                    that.currentProject.phonetic :
                    that.currentProject.name;
                that._say(say);
                that._startTimer();
            })
        },
        lastProject: function() {
            if (this.currentIndex <= 0) {
                return;
            }
            this._stopMusic();
            this._restartTimer();
            this.currentProject = this.projects[--this.currentIndex];
        },
        mute: function () {
            this._stopMusic();
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
        _stopTimer: function () {
            if (! this.timerId) {
                return;
            }

            window.clearInterval(this.timerId);
            this.timerId = null;
            this.time = 0;
        },
        _startTimer: function() {
            var that = this;
            this.timerId = window.setInterval(function() {
                that.time++;

                if (that._shouldStartMusic()) {
                    that._startMusic();
                }

                if (that._shouldTurnUpVolume()) {
                    that._turnUpVolume(0.05);
                }
            }, 1000);
        },
        _restartTimer: function () {
            this._stopTimer();
            this._startTimer();
        },
        _startMusic: function () {
            this.playa.play();
            this.playing = true;
        },
        _stopMusic: function () {
            this.playa.pause();
            this.playa.currentTime = 0;
            this.playa.volume = this.initialVolume;
            this.playing = false;
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
            this.drumroll.play();
        },
        _setKeyListeners: function () {
            var that = this;
            document.onkeypress = function (e) {
                e = e || window.event;

                switch (e.keyCode) {
                    case 76:
                    case 108:
                        that.lastProject();
                        break;

                    case 77:
                    case 109:
                        that._stopMusic();
                        break;

                    case 32:
                        if (document.activeElement.id == 'next' || document.activeElement.id == 'last') {
                            return;
                        }
                        
                        that.nextProject();
                        break;
                }
            };
        },
        _shouldTurnUpVolume: function () {
            return this.timesUp && this.playa.volume < 1 && (this.time % 3 == 0);
        },
        _shouldStartMusic: function () {
            if (this.currentProject.gtfo_music == false) {
                return false;
            }

            return this.time === this.currentTimeLimit;
        },
        _turnUpVolume: function (amount) {
            var newVolume = this.playa.volume + amount;
            this.playa.volume = newVolume > 1 ? 1 : newVolume;
        },
        _getProjects: function() {
            var that = this;
            $.getJSON('/projects.json')
                .done(function(response) {
                    that.projects = _.shuffle(_.shuffle(response.projects));
                    that.projects.push(that.last);
                });
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
                .addSeconds(this.time)
                .toString('mm:ss');
        },
        timesUp: function () {
            return this.time >= this.currentTimeLimit;
        },
        currentTimeLimit: function () {
            if (this.currentProject == undefined || this.currentProject == null) {
                return;
            }
            
            return this.currentProject.extras == undefined ?
                this.timeLimit :
                this.timeLimit + (this.currentProject.extras * 30);
        }
    },
    ready: function() {
        this.playa = document.getElementById('playa');
        this.drumroll = document.getElementById('drumroll');
        this._resetVolume();
        this._getVoices();
        this._setKeyListeners();
        this._getProjects();
    }
});
