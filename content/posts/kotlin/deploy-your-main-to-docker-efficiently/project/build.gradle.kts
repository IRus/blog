plugins {
    kotlin("jvm").version("1.3.72")
    application
}

configure<ApplicationPluginConvention> {
    mainClassName = "by.ibragimov.blog.HelloKt"
}

repositories {
    jcenter()
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))
}
