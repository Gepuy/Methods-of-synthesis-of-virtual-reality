AFRAME.registerComponent('sinusoid-surface', {
    schema: {
      amplitude: {type: 'number', default: 0.3},
      frequency: {type: 'number', default: 5},
      radius: {type: 'number', default: 1.0},
      circleCount: {type: 'number', default: 30},
      segmentsCount: {type: 'number', default: 30},
      color: {type: 'color', default: '#44ff44'},
      wireframe: {type: 'boolean', default: false}
    },
    
    init: function() {
      this.createSurface();
    },
    
    update: function(oldData) {
      if (this.mesh && (
          oldData.amplitude !== this.data.amplitude ||
          oldData.frequency !== this.data.frequency ||
          oldData.radius !== this.data.radius ||
          oldData.circleCount !== this.data.circleCount ||
          oldData.segmentsCount !== this.data.segmentsCount
      )) {
        this.el.removeObject3D('mesh');
        this.createSurface();
      } else if (this.mesh) {
        if (oldData.color !== this.data.color) {
          this.mesh.material.color.set(this.data.color);
        }
        if (oldData.wireframe !== this.data.wireframe) {
          this.mesh.material.wireframe = this.data.wireframe;
        }
      }
    },
    
    createVertex: function(a, n, R, r, b) {
      const x = r * Math.cos(b);
      const y = r * Math.sin(b);
      const z = a * Math.cos(n * Math.PI * r / R);
      return new THREE.Vector3(x, y, z);
    },
    
    createSurface: function() {
      const data = this.data;
      const geometry = new THREE.BufferGeometry();
      
      const vertices = [];
      const indices = [];
      const radius = 1;
      
      const radiusStep = radius / data.circleCount;
      const segmentStep = (2 * Math.PI) / data.segmentsCount;
      const cols = data.segmentsCount + 1;
      
      for (let r_idx = 0; r_idx <= data.circleCount; r_idx++) {
        let r = r_idx * radiusStep;
        for (let b_idx = 0; b_idx <= data.segmentsCount; b_idx++) {
          let beta = b_idx * segmentStep;
          
          let vertex = this.createVertex(data.amplitude, data.frequency, data.radius, r, beta);
          vertices.push(vertex.x, vertex.y, vertex.z);
        }
      }
      
      for (let r_idx = 0; r_idx < data.circleCount; r_idx++) {
        for (let b_idx = 0; b_idx < data.segmentsCount; b_idx++) {
          let v0 = r_idx * cols + b_idx;
          let v1 = v0 + 1;
          let v2 = v0 + cols;
          let v3 = v2 + 1;
          
          indices.push(v0, v1, v2);
          indices.push(v2, v1, v3);
        }
      }
      
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      
      const material = new THREE.MeshStandardMaterial({
        color: data.color,
        side: THREE.DoubleSide,
        wireframe: data.wireframe
      });
      
      this.mesh = new THREE.Mesh(geometry, material);
      this.el.setObject3D('mesh', this.mesh);
    },
    
    remove: function() {
      if (this.mesh) {
        this.el.removeObject3D('mesh');
      }
    }
  });
  
  AFRAME.registerComponent('multi-axis-rotation', {
    schema: {
      enabled: {type: 'boolean', default: true},
      speed: {type: 'number', default: 0.3},
      mode: {type: 'string', default: 'y'} // 'x', 'y', 'z', 'xy', 'xz', 'yz', 'xyz'
    },
    
    init: function() {
      this.rotationValues = {
        x: 0,
        y: 0,
        z: 0
      };
    },
    
    tick: function(time, deltaTime) {
      if (!this.data.enabled) return;
      
      const dt = deltaTime / 1000;
      const speed = this.data.speed;
      const mode = this.data.mode;
      
      if (mode.includes('x')) {
        this.rotationValues.x += dt * speed;
      }
      
      if (mode.includes('y')) {
        this.rotationValues.y += dt * speed;
      }
      
      if (mode.includes('z')) {
        this.rotationValues.z += dt * speed;
      }
      
      this.el.object3D.rotation.x = this.rotationValues.x;
      this.el.object3D.rotation.y = this.rotationValues.y;
      this.el.object3D.rotation.z = this.rotationValues.z;
    }
  });