var Channels = (function() {
    var container = null;
    var button = null;
    var menu = null;
    var channels = [];
    var index = 0;

    // public interface
    return {
        initialize: function(id) {
            container = $('#'+id);
            button = $('#'+id+'-button');
            menu = $('#'+id+'-menu');
            channels = [ "CH1", "CH2", "CH3", "CH4" ];
            container.on('show.bs.dropdown', this.refresh);
        },

        refresh: function() {
            var s = '';
            channels.map(function(channel, i) {
                var active = (i == index) ? 'active' : '';
                s += "<li class='" + active + "'>" + 
                     "<a href='#' onclick='Channels.select(" + i + ")'>" + channel + "</a>" + 
                     "</li>";
            });
            menu.html(s);
            console.log("Channels list refreshed");
        },

        select: function(i) {
            index = i;
            console.log(channels[index] + " selected");
        }
    };
})();
