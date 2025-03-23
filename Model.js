function Model(name) {
    this.name = name;
    this.iVertexBuffer = gl.createBuffer();
    this.iIndexBuffer = gl.createBuffer();
    this.count = 0;
    this.type = gl.TRIANGLES;

    this.BufferData = function(vertices, indices) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        if (indices) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STREAM_DRAW);
            this.count = indices.length;
        } else {
            this.count = vertices.length / 3;
        }
    }

    this.Draw = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);
        
        if (this.type === gl.TRIANGLES && this.iIndexBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
            gl.drawElements(this.type, this.count, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(this.type, 0, this.count);
        }
    }

    this.DrawWireframe = function() {
        if (this.iIndexBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
            for (let p=0; p<this.count; p+=3)
                gl.drawElements(gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, p*2);
        }
    }

    // Surface of Revolution of a General Sinusoid
    this.CreateVertex = function(a, n, R, r, b) {
        const x = r * Math.cos(b),
              y = r * Math.sin(b),
              z = a * Math.cos(n * Math.PI * r / R);
        return [x, y, z];
    }

    this.CreateSinusoidSurface = function(a, n, R, circleCount, segmentsCount) {
        let vertices = [];
        let indices = [];
        let radius = 1;
    
        let radiusStep = radius / circleCount;
        let segmentStep = (2 * Math.PI) / segmentsCount;
        
        // Create vertices
        for (let r_idx = 0; r_idx <= circleCount; r_idx++) {
            let r = r_idx * radiusStep;
            for (let b_idx = 0; b_idx <= segmentsCount; b_idx++) {
                let beta = b_idx * segmentStep;
                
                let vertex = this.CreateVertex(a, n, R, r, beta);
                vertices.push(vertex[0], vertex[1], vertex[2]);
            }
        }
        
        // Create indices
        for (let r_idx = 0; r_idx < circleCount; r_idx++) {
            for (let b_idx = 0; b_idx < segmentsCount; b_idx++) {
                let v0 = r_idx * (segmentsCount + 1) + b_idx;
                let v1 = v0 + 1;
                let v2 = v0 + (segmentsCount + 1);
                let v3 = v2 + 1;
                
                // First triangle
                indices.push(v0, v1, v2);
                
                // Second triangle
                indices.push(v2, v1, v3);
            }
        }
        
        this.BufferData(new Float32Array(vertices), new Uint16Array(indices));
    }
}
