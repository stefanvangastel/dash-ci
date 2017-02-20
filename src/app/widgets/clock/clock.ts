﻿/// <reference path="../types.ts" />

namespace DashCI.Widgets {

    class ClockDirective implements ng.IDirective {
        
        static create(): ng.IDirectiveFactory {
            const directive: ng.IDirectiveFactory =
                () => new ClockDirective();
            directive.$inject = [];
            return directive;
        }


        constructor() { }

        public restrict = "E";
        public templateUrl = "app/widgets/clock/clock.html";
        public replace = false;
        public controller = ClockController;
        public controllerAs = "ctrl";
        /* Binding css to directives */
        public css = {
            href: "app/widgets/clock/clock.css",
            persist: true
        }
    }


    class ClockController implements ng.IController {
        public static $inject = ["$scope", "$interval"];


        constructor(
            private $scope: IWidgetScope,
            private $interval: ng.IIntervalService
        ) {
            this.$scope.data.id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            this.$scope.data.type = WidgetType.clock;

            this.$scope.data.title = "Clock";
            this.$scope.data.footer = false;
            this.$scope.data.header = true;
            this.$scope.data.color = "green";

            this.init();
        }


        public date: string;
        public time: string;

        private init() {
            this.$interval(() => this.setClock(), 1000);

            this.$scope.$watch(
                () => this.$scope.$element.height(),
                (height: number) => this.atualizarFonte(height)
            );
        }


        private atualizarFonte(altura: number) {

            var fontSizeTime = Math.round(altura / 4.5) + "px";
            var lineTime = Math.round((altura / 2) - 20) + "px";
            var fontSizeDate = Math.round(altura / 5.5) + "px";
            var lineDate = Math.round((altura / 2) - 20) + "px";
            var date = this.$scope.$element.find(".date");
            var time = this.$scope.$element.find(".time");
            date.css('font-size', fontSizeDate);
            date.css('line-height', lineDate);
            time.css('font-size', fontSizeTime);
            time.css('line-height', lineTime);
        }

        private _formatDoubleDigit(digit: number) {
            return ('0' + digit).slice(-2);
        }

        private setClock() {
            var now = new Date();
            var locale = 'pt-br';

            var status = {
                year: now.getFullYear(),
                month: (/[a-z]+/gi.exec(now.toLocaleString(locale, { month: "short" })))[0].substring(0, 3),
                day: now.getDate(),
                hours: this._formatDoubleDigit(now.getHours()),
                minutes: this._formatDoubleDigit(now.getMinutes()),
                seconds: this._formatDoubleDigit(now.getSeconds())
            };

            this.date = status.day + ' ' + status.month + ' ' + status.year;
            this.time = status.hours + ':' + status.minutes + ':' + status.seconds;


        }
    }

    DashCI.app.directive("clock", ClockDirective.create());
}