<script lang="ts">
  import { Footer, FooterLink, FooterLinkGroup } from "flowbite-svelte";
</script>

<Footer
  class="w-full bg-gray-800 text-center text-sm text-gray-500 rounded-none mt-20"
>
  <span class="flex items-center font-bold uppercase">
    Semester Project for CS3110 at UCCS
  </span>

  <FooterLinkGroup class="flex items-center text-sm text-gray-500 bg-gray-800">
    <FooterLink href="/about">About</FooterLink>
    <FooterLink
      href="https://github.com/mhay10/CS3110ClassCode"
      target="_blank"
    >
      GitHub
    </FooterLink>
    <FooterLink
      href="https://catalog.uccs.edu/preview_course_nopop.php?catoid=18&coid=102728"
      target="_blank"
    >
      Course Description
    </FooterLink>
  </FooterLinkGroup>
</Footer>
