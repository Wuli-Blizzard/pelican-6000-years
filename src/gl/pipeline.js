// === src/gl/pipeline.js ===
function compileShader(gl, type, source) {
  const s = gl.createShader(type);
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error('Shader compile error: ' + gl.getShaderInfoLog(s));
  }
  return s;
}

class WebGLPostPipeline {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
    if (!this.gl) throw new Error('WebGL2 is required');
    const gl = this.gl;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_UNIFIED);
    this.prog = gl.createProgram();
    gl.attachShader(this.prog, vs);
    gl.attachShader(this.prog, fs);
    gl.linkProgram(this.prog);
    if (!gl.getProgramParameter(this.prog, gl.LINK_STATUS)) {
      throw new Error('Program link error: ' + gl.getProgramInfoLog(this.prog));
    }

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  upload(sourceCanvas) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);
  }

  render(state) {
    const gl = this.gl;
    const p = this.prog;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(p);
    gl.bindVertexArray(this.vao);

    const seamUV = (state.seamScreenX >= -120 && state.seamScreenX <= this.canvas.width + 120)
      ? state.seamScreenX / this.canvas.width
      : 2.0;

    const cam = state.cam || {};

    gl.uniform1i(gl.getUniformLocation(p, 'u_tex'), 0);
    gl.uniform2f(gl.getUniformLocation(p, 'u_resolution'), this.canvas.width, this.canvas.height);
    gl.uniform1f(gl.getUniformLocation(p, 'u_time'), state.t);
    gl.uniform1f(gl.getUniformLocation(p, 'u_beat'), state.beat);
    gl.uniform1f(gl.getUniformLocation(p, 'u_beatPulse'), state.beatPulse);
    gl.uniform1f(gl.getUniformLocation(p, 'u_seamUV'), seamUV);
    gl.uniform1i(gl.getUniformLocation(p, 'u_shaderLeft'), state.leftEra.shader);
    gl.uniform1i(gl.getUniformLocation(p, 'u_shaderRight'), state.rightEra.shader);
    gl.uniform1f(gl.getUniformLocation(p, 'u_lionTremor'), cam.lionGroundTremor || 0.0);
    gl.uniform1f(gl.getUniformLocation(p, 'u_lightning'), cam.lightningFlash || 0.0);
    gl.uniform1f(gl.getUniformLocation(p, 'u_nightVision'), cam.nightVisionAmount || 0.0);
    gl.uniform1f(gl.getUniformLocation(p, 'u_oilImpasto'), cam.oilImpastoAmount || 0.0);
    gl.uniform1f(gl.getUniformLocation(p, 'u_mangaInk'), cam.mangaInkAmount || 0.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
