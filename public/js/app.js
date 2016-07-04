var url = 'http://test-blobupload-service.apps.javelinmc.com/api/blob/upload/file';
$(document).ready(function () {
    if (typeof console != "undefined")
        if (typeof console.log != 'undefined')
            console.olog = console.log;
        else
            console.olog = function () { };

    console.log = function (message) {
        console.olog(message);
        $('#logs').append('<p>' + message + '</p>');
        $('#logs').scrollTop($('#logs')[0].scrollHeight);
    };
    console.error = console.debug = console.info = console.log
    window.allFiles = [];
    var chooseFile = document.getElementById('fielss');
    chooseFile.addEventListener('change', function (e) {
        allFiles = [];
        for (var i = 0; i < this.files.length; i++) {
            var go = new uploadChunk(this.files[i]);
            go.nextByte();
            allFiles.push(go);
        }
    });

    function checkAllFiles() {
        var isAlldone = true;
        for (var i = 0; i < allFiles.length; i++) {
            if (!allFiles[i].isCompleted) {
                isAlldone = false;
                break;
            }
        }
        if (isAlldone) {
            alert("Finished done");
        }
    }
    function uploadChunk(blob) {
        var self = this;
        this.BYTES_PER_CHUNK;
        this.SIZE;
        this.isCompleted = false;
        this.NUM_CHUNKS
        this.start;
        this.end;
        this.isFailed;
        this.chunk;
        this.BYTES_PER_CHUNK = 2097152;//1048576; 1mb
        this.SIZE = blob.size;
        this.NUM_CHUNKS = Math.max(Math.ceil(this.SIZE / this.BYTES_PER_CHUNK), 1);
        this.start = 0;
        this.chunk = 0;
        this.end = this.BYTES_PER_CHUNK;
        this.name = blob.name;
        this.blob = blob;
        this.isFailed = false;
        this.failed = function () {
            self.isFailed = true;
            console.log("failed for chunk "+self.chunk + " of "+ self.name);
            alert("failed chunk");
        }
        this.nextByte = function nextByte() {
            if (self.start < self.SIZE) {
                if (!self.isFailed) {
                    console.log("file <" + self.name + " > :: sending " + self.chunk + " out of " + self.NUM_CHUNKS);
                    upload(self.blob.slice(self.start, self.end), self.NUM_CHUNKS, self.name, self.chunk++, self.failed, self.nextByte);
                    self.start = self.end;
                    self.end = self.start + self.BYTES_PER_CHUNK;
                } else {
                    alert(self.chunk + "failed");
                }
            } else {
                console.log("Completed file < " + self.name + " >");
                self.isCompleted = true;
                checkAllFiles();
            }
        }
        //nextByte(true, SIZE, start);
            
    }
    function upload(blobOrFile, chunks, name, chunk, failed, nextByte) {
        var fd = new FormData();
        fd.append("name", name);
        fd.append('chunk', chunk);
        fd.append('chunks', chunks);
        fd.append('file', blobOrFile);
        
        fd.append('time', new Date().getTime());
        fd.append('user', "temp");
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.upload.onprogress = function (e) {
            var total = 0;
            if (e.lengthComputable) {
                total = Math.round((e.loaded / e.total) * 100);
                //var totalOutOf = ((chunk + 1) * total) / chunks;
               // console.log("% of " + name + "= " + totalOutOf);
            }
            if (total === 100) {
                //nextCalled = true;
                //  nextByte(true);
            }

        };
        xhr.onload = function () {
            // check if upload made itself through
            if (xhr.status >= 400) {
                failed();
                return;
            }
            console.log("file <" + name  + " > :: done sending " + chunk + " out of "+chunks);
            setTimeout(function () {
                nextByte(true);
            }, 1);
        }


        xhr.onloadend = function (e) {
            xhr = null;
        };
        xhr.send(fd);
    };


});