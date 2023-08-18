const hbeTheme = `
<div class="hbe hbe-container" id="hexo-blog-encrypt" data-wpm="{{hbeWrongPassMessage}}" data-whm="{{hbeWrongHashMessage}}">
  <script id="hbeData" type="hbeData" data-hmacdigest="{{hbeHmacDigest}}">{{hbeEncryptedData}}</script>
  <div class="hbe hbe-content">
    <div class="hbe hbe-input hbe-input-default">
      <input class="hbe hbe-input-field hbe-input-field-default" type="password" id="hbePass">
      <label class="hbe hbe-input-label hbe-input-label-default" for="hbePass">
        <span class="hbe hbe-input-label-content hbe-input-label-content-default">{{hbeMessage}}</span>
      </label>
    </div>
  </div>
</div>
`;

module.exports = { hbeTheme };
