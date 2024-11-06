<template>
    <div class="home-footer py-2 d-flex">
        <div class="copyrightSection">
             &copy; {{ new Date().getFullYear() }} SOFTWARE LYNX LLC. &trade;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div class="rightsSection">
            ALL RIGHTS RESERVED | NMLS ID, 457894 | CONTACT US
        </div>
    </div>
</template>

<style lang="scss" scoped>
.home-footer{
  font-size: 10px;
  @media (max-width: $tablet-width) {
    justify-content: center;
  }
  @media (max-width: $mobile-width) {
    flex-direction: column;
    text-align: center;
  }
}
.rightsSection{
  color: $gray3;
}

.copyrightSection{
  color: #424248;
}
</style>
