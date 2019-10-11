<template>
    <v-card>
        <v-card-title>
            Login
        </v-card-title>
        <v-card-text>
            <v-row align="center" justify="center">
                <v-btn @click="fakeLogin()" class="ma-2" dark color='#003366'>BCeID</v-btn>
                <v-btn @click="fakeLogin()" class="ma-2" dark color='#003366'>BCSC</v-btn>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    computed: {
        ...mapGetters('auth', ['isAuthenticated']),
    },
    methods: {
        fakeLogin() {
            //this.$store.commit('auth/setJwtToken', 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJybk9ROU5ucUkwUzAxNHNFZkR2MFA3SVFMMmJYYnpTYjBwRmtuaGFBdXFVIn0.eyJqdGkiOiJmZGMxOTc1OS03OTEwLTQxMWEtYjNiNC1lYjgwNWZiODc4NjQiLCJleHAiOjE1NzA3MzQ0MjIsIm5iZiI6MCwiaWF0IjoxNTcwNzM0MTIyLCJpc3MiOiJodHRwczovL3Nzby5wYXRoZmluZGVyLmdvdi5iYy5jYS9hdXRoL3JlYWxtcy9qc2dicWxpcCIsImF1ZCI6WyJ1bXUtYXV0aCIsInJlYWxtLW1hbmFnZW1lbnQiLCJhY2NvdW50Il0sInN1YiI6ImIwMmMzYzVkLWVjYWUtNDAwNi1iNjkzLWE1Mzc0MzhiZDIwOSIsInR5cCI6IkJlYXJlciIsImF6cCI6InVtdS1hdXRoIiwibm9uY2UiOiJjOTE1MGRkYy0wZjY0LTQxMjYtYjExNy1lZDFjMGE0ODllNGMiLCJhdXRoX3RpbWUiOjE1NzA3MzQxMjIsInNlc3Npb25fc3RhdGUiOiJkYmQyZDllYS1mZGMzLTQ5MjAtOTQzOS04Y2IxOWY4MGIzZmEiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW11LWFjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJ2aWV3LWlkZW50aXR5LXByb3ZpZGVycyIsInZpZXctcmVhbG0iLCJtYW5hZ2UtaWRlbnRpdHktcHJvdmlkZXJzIiwiaW1wZXJzb25hdGlvbiIsInJlYWxtLWFkbWluIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsInF1ZXJ5LXJlYWxtcyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmFnZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9yaXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJ1bXUtYXV0aCI6eyJyb2xlcyI6WyJ1bXUtZ2VuZXJhbCJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgdW11LWFjY2VzcyBvZmZsaW5lX2FjY2VzcyIsInJlYWxtX3JvbGUiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bXUtYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXSwibmFtZSI6Ik5hdGhhbiBEZW5ueSIsInByZWZlcnJlZF91c2VybmFtZSI6Im5kZW5ueUBpZGlyIiwiZ2l2ZW5fbmFtZSI6Ik5hdGhhbiIsImZhbWlseV9uYW1lIjoiRGVubnkiLCJlbWFpbCI6Im5hdGhhbi5kZW5ueUBnb3YuYmMuY2EifQ.kvmmk4DFwGnItwDpsRp0t5BMWfmC1y4t_ilErh1lkS07xIbN6wtI4_dpS8DGZWFh_hlC6_yYnAx2noqhZae9Y_0E0OY8_jqmpKgTCb9LJCXra0GB9dnsBPUtQZyTAs1Rcd24O7HCi_kLKU9RDKKVUyRxYmH_d_zyoGWo4Cj5fe2QbIrQr1vLfrYus5qCq76S5JQofnbMBsxV-EsQWJRevltxJTiVLncm5oRN1usMBMscDRzyCkkW083Sly7olzUC5vExA4g-vdPS-XVjDSDdLp9cbU9RCm9HmzP0fvIFhYhaEP0hs1mlIRD_GSlGWgva4boHjKhA8r4OZEKwpDTHnw');
            //this.$store.commit('auth/setRefreshToken', 'fakeToken');
            this.$router.push('home');
        }
    }
};
</script>
