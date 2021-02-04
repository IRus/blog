---
title: "Publish maven artifact to S3"
date: 2021-02-04
categories:
- Gradle
- Highlights
---

## Create AWS account

[https://aws.amazon.com/](https://aws.amazon.com/)

## Create AWS S3 Bucket and make it public

**Bucket policy**
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::bucket-name",
                "arn:aws:s3:::bucket-name/*"
            ]
        }
    ]
}
```

{{< video src="./create-public-bucket.mp4" >}}

## Create AWS Credentials

1. Create IAM Policy
2. Create IAM Group
3. Create IAM User

{{< video src="./create-aws-credentials.mp4" >}}

**AWS Credentials**
```
AWS_ACCESS_KEY_ID: AKIAWEMDLXBHKYY2SV45
AWS_SECRET_ACCESS_KEY: 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
```

## Setup `maven-publish` plugin in Gradle

```kotlin
plugins {
    kotlin("jvm").version("1.4.21")
    `maven-publish`
}

group = "io.heapy.deploy-sample"
version = "1.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
}

publishing {
    repositories {
        maven {
            url = uri("s3://simple-repo")
            credentials(AwsCredentials::class) {
                accessKey = System.getenv("AWS_ACCESS_KEY_ID")
                secretKey = System.getenv("AWS_SECRET_ACCESS_KEY")
            }
        }
    }

    publications {
        create<MavenPublication>("sample") {
            from(project.components["java"])
        }
    }
}
```

**Publish command**

```bash
export AWS_ACCESS_KEY_ID=AKIAWEMDLXBHKYY2SV45; export AWS_SECRET_ACCESS_KEY=kUr2HUHcDlDkqBkIZw6//HXzk3j7Wmzs3fFBB+JV; ./gradlew publish
```

## Use repo in project

```kotlin
plugins {
    kotlin("jvm").version("1.4.21")
}

group = "io.heapy.deploy-sample"
version = "1.0"

repositories {
    maven {
        url = uri("https://simple-repo.s3.eu-central-1.amazonaws.com")
    }
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("io.heapy.deploy-sample:deploy-sample:1.0")
}
```

## Add repo to repo.kotlin.link (Optional)

In [Heapy/repo.kotlin.link](https://github.com/Heapy/repo.kotlin.link) edit [index.yml](https://github.com/Heapy/repo.kotlin.link/blob/main/src/main/resources/index.yml):

```yaml
"https://simple-repo.s3.eu-central-1.amazonaws.com":
    - "io.heapy.deploy-sample"
```

After your PR accepted, you can replace `https://simple-repo.s3.eu-central-1.amazonaws.com` with `https://repo.kotlin.link` in `build.gradle.kts`:

```kotlin
plugins {
    kotlin("jvm").version("1.4.21")
}

group = "io.heapy.deploy-sample"
version = "1.0"

repositories {
    maven {
        url = uri("https://repo.kotlin.link")
    }
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("io.heapy.deploy-sample:deploy-sample:1.0")
}
```
