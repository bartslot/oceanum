import Hero from "@/components/about/hero";
import About from "@/components/about/about";

import { METADATA } from "../constants";
import Head from "next/head";
import { useEffect, useState } from "react";

import Layout from "@/components/common/layout";
import Header from "@/components/common/header";
import Menu from "@/components/common/menu";
import ProgressIndicator from "@/components/common/progress-indicator";
import Cursor from "@/components/common/cursor";

import Footer from "@/components/common/footer";
import Scripts from "@/components/common/scripts";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { gsap } from "gsap";

export default function Aboutpage() {
    <Hero />;
    <About />;
}
