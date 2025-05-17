document.addEventListener('DOMContentLoaded', function() {
    const marker = document.querySelector('#marker');
    const sinusoidEntity = document.getElementById('sinusoid');
    const cubeEntity = document.getElementById('cube');
    const infoPanel = document.getElementById('info');
    
    let wireframeEnabled = false;
    let cubeOpacity = 0.3;
    let rotationSpeed = 0.3;
    
    const rotationModes = [
      {mode: 'y', label: 'Y'},
      {mode: 'x', label: 'X'},
      {mode: 'z', label: 'Z'},
      {mode: 'xy', label: 'XY'},
      {mode: 'xz', label: 'XZ'},
      {mode: 'yz', label: 'YZ'},
      {mode: 'xyz', label: 'XYZ'}
    ];
    let modeIndex = 0;
    
    const sizeLevels = [
      {x: 0.35, y: 0.35, z: 0.35},
      {x: 0.25, y: 0.25, z: 0.25},
      {x: 0.45, y: 0.45, z: 0.45},
      {x: 0.15, y: 0.15, z: 0.15}
    ];
    let sizeIndex = 0;
    
    const speedLevels = [0.3, 0.1, 0.5, 0.8];
    let speedIndex = 0;
    
    const colorSchemes = [
      { surface: '#ff5a5a', cube: '#4287f5' }, // червона поверхня, синій куб
      { surface: '#5aff5a', cube: '#ff87f5' }, // зелена поверхня, рожевий куб
      { surface: '#5a5aff', cube: '#f5ff87' }, // синя поверхня, жовтий куб
      { surface: '#ffff5a', cube: '#875aff' }  // жовта поверхня, фіолетовий куб
    ];
    let colorIndex = 0;
    
    const opacityLevels = [0.3, 0.5, 0.7, 0.1];
    let opacityIndex = 0;
    
    marker.addEventListener('markerFound', function() {
      infoPanel.textContent = 'Маркер знайдено!';
      infoPanel.style.backgroundColor = 'rgba(0, 128, 0, 0.5)';
      console.log('Маркер знайдено!');
    });
    
    marker.addEventListener('markerLost', function() {
      infoPanel.textContent = 'Маркер втрачено!';
      infoPanel.style.backgroundColor = 'rgba(128, 0, 0, 0.5)';
      console.log('Маркер втрачено!');
    });
    
    document.getElementById('btn-wireframe').addEventListener('click', function() {
      wireframeEnabled = !wireframeEnabled;
      sinusoidEntity.setAttribute('sinusoid-surface', 'wireframe', wireframeEnabled);
      
      this.classList.toggle('active', wireframeEnabled);
    });
    
    document.getElementById('btn-color').addEventListener('click', function() {
      colorIndex = (colorIndex + 1) % colorSchemes.length;
      const colors = colorSchemes[colorIndex];
      
      sinusoidEntity.setAttribute('sinusoid-surface', 'color', colors.surface);
      cubeEntity.setAttribute('color', colors.cube);
    });
    
    document.getElementById('btn-cube-opacity').addEventListener('click', function() {
      opacityIndex = (opacityIndex + 1) % opacityLevels.length;
      cubeOpacity = opacityLevels[opacityIndex];
      
      cubeEntity.setAttribute('material', 'opacity', cubeOpacity);
      this.textContent = `Прозор: ${Math.round(cubeOpacity * 100)}%`;
    });
    
    document.getElementById('btn-axis').addEventListener('click', function() {
      modeIndex = (modeIndex + 1) % rotationModes.length;
      const mode = rotationModes[modeIndex];
      
      sinusoidEntity.setAttribute('multi-axis-rotation', 'mode', mode.mode);
      this.textContent = `Вісь: ${mode.label}`;
    });
    
    document.getElementById('btn-size').addEventListener('click', function() {
      sizeIndex = (sizeIndex + 1) % sizeLevels.length;
      const newSize = sizeLevels[sizeIndex];
      
      sinusoidEntity.setAttribute('scale', `${newSize.x} ${newSize.y} ${newSize.z}`);
      this.textContent = `Розмір: ${newSize.x}`;
    });
    
    document.getElementById('btn-speed').addEventListener('click', function() {
      speedIndex = (speedIndex + 1) % speedLevels.length;
      rotationSpeed = speedLevels[speedIndex];
      
      sinusoidEntity.setAttribute('multi-axis-rotation', 'speed', rotationSpeed);
      this.textContent = `Швид: ${rotationSpeed.toFixed(1)}`;
    });
    
    document.getElementById('btn-speed').addEventListener('dblclick', function(e) {
      e.preventDefault();
      const currentEnabled = sinusoidEntity.getAttribute('multi-axis-rotation').enabled;
      
      sinusoidEntity.setAttribute('multi-axis-rotation', 'enabled', !currentEnabled);
      
      if (!currentEnabled) {
        this.textContent = `Швид: ${rotationSpeed.toFixed(1)}`;
        this.classList.add('active');
      } else {
        this.textContent = `Зупинено`;
        this.classList.remove('active');
      }
    });
    
    document.getElementById('btn-cube-opacity').textContent = `Прозор: ${Math.round(cubeOpacity * 100)}%`;
    document.getElementById('btn-axis').textContent = `Вісь: Y`;
    document.getElementById('btn-size').textContent = `Розмір: 0.35`;
    document.getElementById('btn-speed').textContent = `Швид: ${rotationSpeed.toFixed(1)}`;
    document.getElementById('btn-speed').classList.add('active');
  });